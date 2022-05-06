const {register} = require('../controller/user-register');
const {login} = require('../controller/user-login')
const {  resetPassword, updatePassword } = require('../controller/reset-password')

const router = require('express').Router()


router.post('/register', register)
router.post('/login', login)
router.post('/reset', resetPassword)
router.post('/updatePassword', updatePassword)


 module.exports = {router}