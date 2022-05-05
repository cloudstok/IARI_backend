const { conn } = require('./db')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const test = (req, res) => {
    res.send("hello")
}
const register = async (req, res) => {
    const obj = {
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        password: req.body.password
    }
    var sql1 = ` select * from register where email = '${obj.email}'`
    conn.query(sql1, async (err, result) => {
        if (err) {
            return res.send({ ERROR: err })
        }
        else if (result.length > 0) {
            return res.send({ msg: 'user already exist' })
        }
        else {
            const hash = await bcrypt.hash(obj.password, 12)
            var sql = `INSERT INTO register (name, email, mobile , password, registered_on) VALUES ('${obj.name}' , '${obj.email}' , '${obj.mobile}','${hash}', '${new Date()}')`
            conn.query(sql, async (err, result) => {
                if (err) {
                    return res.send({ ERROR: err })
                }
                else {
                    return res.send("user registered successfully")
                }
            })
        }
    })


}

const login = async (req, res) => {
    const obj = {
        email: req.body.email,
        password: req.body.password
    }
    let sql1 = ` select * from register where email = '${obj.email}'`
    conn.query(sql1, async (err, result) => {
        if (err) {
            return res.send({ ERROR: err })
        }
        else if (result.length === 0) {
            return res.send({ msg: 'You are not registered, Please register first!' })
        }
        else {
            const match = await bcrypt.compare(obj.password, result[0].password);
            if (match === true) {
                var token = jwt.sign({ data: result }, 'shhhhh');
                return res.send({ msg: "user logged in successfully", token: { token }, user: result[0].name });

            }
        }
    })
}

const resetPassword = async (req, res, next ) => {
    try {
        const object = {
            email: req.body.email,
        }
        const otp = await otpGenerator.generate(6, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        });
        let transporter = await nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'gprashantgupta30@gmail.com',
                pass: 'Nishant@07'
            }
        });
        let mailOptions = {
            from: 'gprashantgupta30@gmail.com',
            to: obj.email,
            subject: "Reset Password OTP",
            text: `OTP to reset your password is ${otp}`
        }

        let sql = `SELECT * FROM register where email = '${obj.email}'`;
        conn.query(sql, async (err, row) => {
            if (err) {
                return res.status(404).send({ status: 0, msg: err })
            }
            if (row.length > 0) {
                if (row[0].otp === null) {
                    transporter.sendMail(mailOptions, (err, result) => {
                        if (err) {
                            return res.status(404).send({ status: 0, msg: err })
                        }
                        else {
                            let sql = `INSERT INTO register (otp) VALUES ('${otp}')`
                            conn.query(sql, (err, rows) => {
                                if (err) {
                                    return res.status(500).send({ status: 0, msg: "Something went wrong" })
                                }
                                else {
                                    return res.status(200).send({ status: 1, message: "Email sent successfully" })
                                }
                            })

                        }
                    })
                }
                else {
                    transporter.sendMail(mailOptions, (err, result) => {
                        if (err) {
                            return res.status(404).send({ status: 0, msg: err })
                        }
                        else {
                            let sql = `UPDATE table register SET otp = '${otp}'`
                            conn.query(sql, (err, rows) => {
                                if (err) {
                                    return res.status(500).send({ status: 0, msg: "Something went wrong" })
                                }
                                else {
                                    return res.status(200).send({ status: 1, message: "Email sent successfully" })
                                }
                            })

                        }
                    })
                }
            }
            else {
                return res.status(404).send({ status: 0, msg: "User not found" })

            }
        })
    }
    catch (error) {
        return res.status(500).send({ msg: "Something went wrong" })
    }
}



module.exports = {
    test,
    register,
    login,
    resetPassword
}