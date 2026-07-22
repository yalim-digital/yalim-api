const express =
require('express');


const router =
express.Router();




const controller =
require('./domainesActions.controller');



const {
    authenticate
} =
require('../../middlewares/auth.middleware');



const {
    isAdmin
} =
require('../../middlewares/role.middleware');









/**
 * ======================================
 * PUBLIC
 * ======================================
 */





/**
 * Liste des domaines d'action actifs
 *
 * GET /domaines-actions
 */
router.get(

    "/",

    controller.getPublic

);









/**
 * ======================================
 * ADMIN
 * ======================================
 */





/**
 * Liste complète
 *
 * GET /domaines-actions/admin
 */
router.get(

    "/admin",

    authenticate,

    isAdmin,

    controller.getAll

);







/**
 * Détail domaine d'action
 *
 * GET /domaines-actions/:id
 */
router.get(

    "/:id",

    authenticate,

    isAdmin,

    controller.getById

);







/**
 * Créer un domaine d'action
 *
 * POST /domaines-actions
 *
 * multipart/form-data
 * file: image
 */
router.post(

    "/",

    authenticate,

    isAdmin,

    controller.create

);







/**
 * Modifier un domaine d'action
 *
 * PUT /domaines-actions/:id
 *
 * multipart/form-data
 * file: image (optionnel)
 */
router.put(

    "/:id",

    authenticate,

    isAdmin,

    controller.update

);







/**
 * Supprimer un domaine d'action
 *
 * DELETE /domaines-actions/:id
 */
router.delete(

    "/:id",

    authenticate,

    isAdmin,

    controller.remove

);






module.exports =
router;