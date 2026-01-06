const Joi = require("joi");

const licenseCreateDTO = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    status: Joi.string().regex(/^(active|inactive)$/).required().default('inactive'),
    link: Joi.string().required()
}).unknown()



const licenseUpdateDTO = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    status: Joi.string().regex(/^(active|inactive)$/).required().default('inactive'),
    image: Joi.string().optional(),
    link: Joi.string()

})

module.exports = {
    licenseCreateDTO,
    licenseUpdateDTO
}