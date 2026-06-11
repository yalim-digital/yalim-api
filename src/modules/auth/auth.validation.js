const Joi = require('joi');

const registerSchema = Joi.object({

    nom_complet: Joi.string().required(),

    email: Joi.string()
        .email()
        .required(),

    telephone: Joi.string()
        .required(),

    mention: Joi.string()
        .allow('', null),

    parcours: Joi.string()
        .allow('', null),

    niveau: Joi.string()
        .allow('', null),

    date_naissance: Joi.date()
        .required(),

    sexe: Joi.string()
        .valid(
            'Masculin',
            'Féminin'
        )
        .required(),

    cin: Joi.string()
        .required(),

    password: Joi.string()
        .min(6)
        .required(),

    type_membre: Joi.string()
        .required()
});

module.exports = {
    registerSchema
};