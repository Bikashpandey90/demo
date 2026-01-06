const Joi = require("joi");



const recipeCreateDTO = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    status: Joi.string().regex(/^(active|inactive)$/).required().default('inactive'),
    tagline: Joi.string().required(),
    content: Joi.string().required()

}).unknown()



const recipeUpdateDTO = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    status: Joi.string().regex(/^(active|inactive)$/).required().default('inactive'),
    tagline: Joi.string().max(200).required(),
    existingImages: Joi.alternatives().try(
        Joi.array().items(Joi.object({ url: Joi.string().uri().required(), position: Joi.number().required() })),
        Joi.string()
    ),

    images: Joi.string().optional(),
    content: Joi.string().required()

})

module.exports = {
    recipeCreateDTO,
    recipeUpdateDTO
}