const express =
require('express');


const router =
express.Router();




const controller =
require('./documentsPublics.controller');




const upload =
require('../../middlewares/upload.middleware');



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
 * Liste des documents publics actifs
 *
 * GET /documents-publics
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
 * GET /documents-publics/admin
 */
router.get(

    "/admin",

    authenticate,

    isAdmin,

    controller.getAll

);







/**
 * Détail document
 *
 * GET /documents-publics/:id
 */
router.get(

    "/:id",

    authenticate,

    isAdmin,

    controller.getById

);







/**
 * Créer un document
 *
 * POST /documents-publics
 *
 * multipart/form-data
 * file: fichier
 */
router.post(

    "/",

    authenticate,

    isAdmin,

    upload.single("fichier"),

    controller.create

);







/**
 * Modifier un document
 *
 * PUT /documents-publics/:id
 *
 * multipart/form-data
 * file: fichier (optionnel)
 */
router.put(

    "/:id",

    authenticate,

    isAdmin,

    upload.single("fichier"),

    controller.update

);







/**
 * Supprimer un document
 *
 * DELETE /documents-publics/:id
 */
router.delete(

    "/:id",

    authenticate,

    isAdmin,

    controller.remove

);






module.exports =
router;