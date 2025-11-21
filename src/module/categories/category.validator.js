const Joi = require("joi");

const categoryCreateDTO = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    status: Joi.string().regex(/^(active|inactive)$/).required().default('inactive'),
    primaryColor: Joi.string().min(7).max(7).required(),
    secondaryColor: Joi.string().min(7).max(7).required(),
    backgroundColor: Joi.string().min(7).max(7).required(),



}).unknown()
const categoryUpdateDTO = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    status: Joi.string().regex(/^(active|inactive)$/).required().default('inactive'),
    primaryColor: Joi.string().min(7).max(7).required(),
    secondaryColor: Joi.string().min(7).max(7).required(),
}).unknown()

module.exports = {
    categoryCreateDTO,
    categoryUpdateDTO

}