require('dotenv').config()
const jwt = require("jsonwebtoken")
const authSvc = require('../module/auth/auth.service')

const checkLogin = async (req, res, next) => {
    try {
        let token = req.headers['authorization'] || null
        if (!token) {
            throw {
                code: 401, message: "Token required", status: "TOKEN_EXPECTED"
            }
        }
        token = token.split(' ').pop()

        const data = jwt.verify(token, process.env.JWT_SECRET)

        if (data.typ !== 'bearer') {
            throw {
                code: 403, message: "Invalid token", status: "TOKEN_INVALID"
            }
        }

        const user = await authSvc.getSingleUserByFilter({
            _id: data.sub
        })
        if (!user) {
            throw {
                code: 401, message: "User does not exist", status: "USER_NOT_FOUND"
            }
        }
        console.log(user)
        req.authUser = {
            _id: user._id,
            name: user.name,
            role: user.role,
            email: user.email,
            status: user.status
        }
        next()

    } catch (exception) {
        if (exception.name === 'TokenExpiredError') {
            next({
                code: 401, message: "Token Expired", status: "TOKEN_EXPIRED"
            })
        } else if (exception.name === 'JsonWebTokenError') {
            next({ code: 401, message: exception.message, status: "TOKEN_ERROR" })
        }

    }
}
module.exports = {
    checkLogin
}