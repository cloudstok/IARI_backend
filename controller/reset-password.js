const { conn } = require('../config/db');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
require('dotenv').config();



const resetPassword = async (req, res ) => {
    try {
        let obj = {
            email: req.body.email,
        }
        let otp = await otpGenerator.generate(6, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        });
        let transporter = await nodemailer.createTransport( {
            service: process.env.SERVICE,
            auth: {
                user: process.env.USERNAME,
                pass: process.env.PASS
            }
        });
        let mailOptions = {
            from: 'no-reply@iari.com',
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
                    transporter.sendMail(mailOptions, (err, result) => {
                        if (err) {
                            return res.status(404).send({ status: 0, msg: err })
                        }
                        else {

                            let sql = `UPDATE REGISTER set otp= '${otp}' where email= '${obj.email}'`
                            conn.query(sql, (err, rows) => {
                                if (err) {
                                    return res.status(500).send({ status: 0, msg: "Something went wrong", err: err })
                                }
                                else {
                                    return res.status(200).send({ status: 1, message: "Email sent successfully" })
                                }
                            })

                        }
                    })
            }
            else {
                return res.status(404).send({ status: 0, msg: "User not found" })

            }   
        })
    }
    catch (error) {
        return res.status(500).send({ msg: "Something went wrong", err :error })
    }
}

    const updatePassword = (req, res)=> {
        try{
            let obj = {
                otp: req.body.otp,
                newPass: req.body.password
            }
           
                let sql = `SELECT * FROM register WHERE otp = '${obj.otp}'`;
                    conn.query(sql, (err, match)=>{
                        if(err){
                            return res.status(404).send({status:0, msg: "Internal Server Error"})
                        }
                        if(match === true){
                            let sql1 = `UPDATE register SET password = '${obj.newPass}', otp = null WHERE otp = '${obj.otp}'`;
                            conn.query(sql1, (err, row)=>{
                                if(err){
                                    return res.status(400).send({status:0, msg: "Internal Server Error"})
                                }else{
                                    return res.status(200).send({status:1, msg: "Password Changed Successfully"})
                                }
                            })
                        }else{
                            return res.status(400).send({status:0, msg: "Invalid OTP"})
                        }
                    })
        }
        catch(error){
            return res.status(500).send({status:0, msg: "Something went wrong"})
        }
    }


module.exports = {
    resetPassword,
    updatePassword
}