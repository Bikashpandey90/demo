const { checkLogin } = require('../../middlewares/auth.middleware')
const { bodyValidator } = require('../../middlewares/body.validator')
const authCtrl = require('./auth.controller')
const { loginDTO } = require('./auth.validator')

const authRouter = require('express').Router()

authRouter.post('/login', bodyValidator(loginDTO), authCtrl.login)
authRouter.get('/me', checkLogin, authCtrl.profile)


module.exports = authRouter