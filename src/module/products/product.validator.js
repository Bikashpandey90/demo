const Joi = require("joi");

const productCreateDTO = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    status: Joi.string().regex(/^(active|inactive)$/).required().default('inactive'),
    category: Joi.string().required(),
    price: Joi.number().min(100).required(),
    tagline: Joi.string().max(200).required(),
    description: Joi.object({
        ingridients: Joi.string().min(100).required(),
        nutritionalInfo: Joi.string().min(100).required(),
        direction: Joi.string().min(100).required()
    }).required()

}).unknown()
const productUpdateDTO = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    status: Joi.string().regex(/^(active|inactive)$/).required().default('inactive'),
    category: Joi.string().required(),
    price: Joi.number().min(100).required(),
    tagline: Joi.string().max(200).required(),
    description: Joi.object({
        ingridients: Joi.string().min(100).required(),
        nutritionalInfo: Joi.string().min(100).required(),
        direction: Joi.string().min(100).required()
    }).required()

})

module.exports = {
    productCreateDTO,
    productUpdateDTO
}