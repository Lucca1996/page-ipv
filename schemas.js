const Joi = require('joi')

module.exports.noticiaSchema = Joi.object({
    noticia: Joi.object({
        title: Joi.string().required(),
        category: Joi.string().required(),
        subtitle: Joi.string().required(),
        videos: Joi.string().allow(''),
        date: Joi.date().allow(''),
        // images: Joi.string().required(),
        content: Joi.string().required(),
        location: Joi.string().required()
    }).required(),
    deleteImages: Joi.array()
})