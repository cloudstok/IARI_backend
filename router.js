const { test, register } = require('./controller')

const router = require('express').Router()
router.get('/test' ,test)
router.post('/register', register)
 module.exports = {router}