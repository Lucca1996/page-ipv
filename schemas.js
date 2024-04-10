const Joi = require('joi')

module.exports.noticiaSchema = Joi.object({
    noticia: Joi.object({
        title: Joi.string().required(),
        image: Joi.string().required(),
        content: Joi.string().required(),
        location: Joi.string().required()
    }).required()
})