const Joi = require("joi");

const loginDTO = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

module.exports = {
    loginDTO
}