const {conn} = require('./db')
const test = (req , res )=>{
    res.send("hello")
}
const register =(req , res )=>{
    const obj = {
    name :req.body.name,
    email :req.body.email,
    phone : req.body.phone
}

var sql = `INSERT INTO register (name, email, phone) VALUES ('${obj.name}' , '${obj.email}' , '${obj.phone}')`
conn.query(sql , (err, result)=>{
    if(err){
        return res.send({ERROR : err})
    }
    else{
        return res.send("user registered successfully")
    }
})
}

module.exports = {
    test,
    register

}