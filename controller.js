const { conn } = require('./db')
const bcrypt = require('bcrypt');
const test = (req, res) => {
    res.send("hello")
}
const register = async (req, res) => {
    const obj = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password
    }
    var sql1 = ` select * from register where phone = '${obj.phone}'`
    conn.query(sql1, async (err, result) => {
        if (err) {
            return res.send({ ERRoR: errr })
        }
        else if (result.length > 0) {
            return res.send({ msg: 'user already exist' })
        }
        else {
            const hash = await bcrypt.hash(obj.password, 12)
            console.log(hash)
            var sql = `INSERT INTO register (name, email, phone , password) VALUES ('${obj.name}' , '${obj.email}' , '${obj.phone}','${hash}')`
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
    var sql1 = ` select * from register where email = '${obj.email}'`
    conn.query(sql1, async (err, result) => {
        if (err) {
            return res.send({ ERROR: err })
        }
        else if (result.length > 0) {
            if (rows[0].email !== body.email && rows[0].password !== body.password) {
                return res.status(404).send({ status: 0, msg: "You are not registered" });
            }
            return res.send({ msg: 'Please register first!' })
        }
        else {
            const match = await bcrypt.compare(body.password, rows[0].password);
            if (match === true) {
                let sql = `INSERT into login (email,password, login_on) values (?,?,?)`;
                await conn.execute(sql, [body.email, body.password, new Date()], async (err, result) => {
                    if (err) {
                        return req.status(404).send({ err: err });
                    }
                    else {
                        return res.send("user logged in successfully")
                    }
                })
            }}
        })
}

module.exports = {
    test,
    register,
    login
}