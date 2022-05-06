const { conn } = require('../config/db')
const bcrypt = require('bcrypt');
require('dotenv').config();


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
            const hash = await bcrypt.hash(obj.password, process.env.SALT_ROUNDS)
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


module.exports = {register}