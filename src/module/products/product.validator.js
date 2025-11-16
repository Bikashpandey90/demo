const Joi = require("joi");

const nutritionalInfoSchema = Joi.object({
    header: Joi.string().min(10).required(),
    rows: Joi.array().items(
        Joi.object({
            values: Joi.string().allow(""),
            perValue: Joi.string().allow(""),
            perPacket: Joi.string().allow("")
        })
    ).required(),
    footer: Joi.string().min(10).required(),
    links: Joi.array().items(Joi.string().uri()).default([])
}).required();
const directionImageSchema = Joi.array().items(
    Joi.object({
        // order: Joi.number().required(),
        description: Joi.string().allow(""),
        // url is added after file upload → not required
    })
);

const productCreateDTO = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    status: Joi.string().regex(/^(active|inactive)$/).required().default('inactive'),
    category: Joi.string().required(),
    allergyAdvice: Joi.string().min(100).required(),
    tagline: Joi.string().min(100).required(),
    vegNonVeg: Joi.string().valid("veg", "nonveg").default("nonveg"),
    ingridients: Joi.string().min(100).required(),
    nutritionalInfo: Joi.string(),
    directionImages: directionImageSchema,

}).unknown()



//update this too
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