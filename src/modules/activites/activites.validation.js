const Joi = require('joi');


const activiteSchema = Joi.object({

    titre: Joi
        .string()
        .min(3)
        .max(255)
        .required()
        .messages({
            "string.empty":
                "Le titre est obligatoire",
            "string.min":
                "Le titre doit contenir au moins 3 caractères"
        }),


    description: Joi
        .string()
        .allow('', null),


    date_debut: Joi
        .date()
        .required()
        .messages({
            "date.base":
                "La date de début est invalide",
            "any.required":
                "La date de début est obligatoire"
        }),


    date_fin: Joi
        .date()
        .allow('', null),


    lieu: Joi
        .string()
        .max(255)
        .allow('', null),


    type_activite: Joi
        .string()
        .valid(
            'gratuit',
            'payant',
            'prise_en_charge'
        )
        .required()
        .messages({
            "any.only":
                "Type d'activité invalide"
        }),


    montant: Joi
        .number()
        .min(0)
        .allow(null, ''),


    statut: Joi
        .string()
        .valid(
            'planifiee',
            'terminee',
            'annulee'
        )
        .default('planifiee')

});


module.exports = {
    activiteSchema
};