const { conn } = require('../config/db')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
require('dotenv').config();


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
                var token = jwt.sign({ data: result }, process.env.SECRET_PASS);
                return res.send({ msg: "user logged in successfully", token: { token }, user: result[0].name });

            }
        }
    })
}

module.exports = {login}