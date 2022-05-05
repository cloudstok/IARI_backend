const { test, register, login, resetPassword } = require('./controller')

const router = require('express').Router()
router.get('/test' ,test)
router.post('/register', register)
router.post('/login', login)
router.post('/reset', resetPassword)
 module.exports = {router}