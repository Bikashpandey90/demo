const UserModel = require("../../user.model")

class authService {
    getSingleUserByFilter = async (filter) => {
        try {
            const user = await UserModel.findOne(filter)
            if (!user) {
                throw {
                    code: "422",
                    status: "USER_NOT_FOUND",
                    message: "User not found"
                }
            }
            return user

        } catch (exception) {

        }
    }

}
const authSvc = new authService()
module.exports = authSvc