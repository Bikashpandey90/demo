const authSvc = require("./auth.service")
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")

class authController {

    login = async (req, res, next) => {
        try {
            const data = req.body
            const user = await authSvc.getSingleUserByFilter({
                email: data.email
            })
            if (user.status !== 'active') {
                throw {
                    code: 401,
                    message: "User is not active",
                    status: "USER_NOT_ACTIVE"
                }
            }
            if (bcrypt.compareSync(data.password, user.password)) {

                let accessToken = jwt.sign({
                    sub: user._id,
                    typ: "bearer"
                }, process.env.JWT_SECRET, {
                    expiresIn: "5d"
                }
                );
                let refreshToken = jwt.sign({
                    sub: user._id,
                    typ: "refresh"
                }, process.env.JWT_SECRET, {
                    expiresIn: "30d"
                }
                );
                res.json({
                    detail: {
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        user: {
                            _id: user._id,
                            name: user.name,
                            email: user.email,
                            role: user.role
                        }
                    },
                    message: "User Login Success",
                    status: "LOGIN_SUCCESS",
                    options: null
                })
            } else {
                throw {
                    code: 401,
                    message: "Invalid Password",
                    status: "INVALID_PASSWORD"
                }
            }

        } catch (exception) {
            console.log("Login exception : ", exception)
            next(exception)
        }
    }

}
const authCtrl = new authController()
module.exports = authCtrl