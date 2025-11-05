const Joi = require("joi");

const categoryCreateDTO = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    status: Joi.string().regex(/^(active|inactive)$/).required().default('inactive')

}).unknown()
const categoryUpdateDTO = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    status: Joi.string().regex(/^(active|inactive)$/).required().default('inactive')
}).unknown()

module.exports = {
    categoryCreateDTO,
    categoryUpdateDTO

}