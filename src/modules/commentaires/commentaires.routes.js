const express =
    require('express');


const router =
    express.Router();



const controller =
    require('./commentaires.controller');



const {
    authenticate
} = require(
    '../../middlewares/auth.middleware'
);

/**
 * Liste des commentaires
 *
 * GET
 * /api/publications/:id/commentaires
 */
router.get(

    '/publications/:id/commentaires',

    authenticate,

    controller.getComments

);







/**
 * Ajouter un commentaire
 *
 * POST
 * /api/publications/:id/commentaires
 */
router.post(

    '/publications/:id/commentaires',

    authenticate,

    controller.createComment

);








/**
 * Supprimer un commentaire
 *
 * DELETE
 * /api/commentaires/:id
 */
router.delete(

    '/commentaires/:id',

    authenticate,

    controller.deleteComment

);







module.exports =
    router;