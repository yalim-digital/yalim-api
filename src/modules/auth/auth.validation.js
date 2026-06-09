const Joi = require('joi');

const registerSchema = Joi.object({

    nom_complet: Joi.string()
        .required(),

    email: Joi.string()
        .email()
        .required(),

    telephone: Joi.string()
        .required(),

    sexe: Joi.string()
        .valid(
            'Masculin',
            'Féminin'
        )
        .required(),

    password: Joi.string()
        .min(6)
        .required()

});

module.exports = {
    registerSchema
};