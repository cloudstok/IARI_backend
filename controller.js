const { conn } = require('./db')
var jwt = require('jsonwebtoken');
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
    var sql1 = ` select * from register where email = '${obj.email}'`
    conn.query(sql1, async (err, result) => {
        if (err) {
            return res.send({ ERRoR: errr })
        }
        else if (result.length > 0) {
            return res.send({ msg: 'user already exist' })
        }
        else {
            const hash = await bcrypt.hash(obj.password, 12)
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
        else if (result.length===0) {
            return res.send({ msg: 'Please register first!' })
        }
        else {
            const match = await bcrypt.compare(obj.password, result[0].password);
            if (match === true) {
                        var token = jwt.sign({ data: result}, 'shhhhh');
                        return res.send({msg:"user logged in successfully", token:{token}});

            }}
        })
}

module.exports = {
    test,
    register,
    login
}