const express =
require('express');


const router =
express.Router();




const controller =
require('./projets.controller');




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
 * Liste projets publics
 *
 * GET /projets
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
 * Liste admin
 *
 * GET /projets/admin
 */
router.get(

    "/admin",

    authenticate,

    isAdmin,

    controller.getAll

);







/**
 * Détail projet
 *
 * GET /projets/:id
 */
router.get(

    "/:id",

    authenticate,

    isAdmin,

    controller.getById

);







/**
 * Créer un projet
 *
 * POST /projets
 *
 * multipart/form-data
 * file: image
 */
router.post(

    "/",

    authenticate,

    isAdmin,

    upload.single("image"),

    controller.create

);







/**
 * Modifier un projet
 *
 * PUT /projets/:id
 *
 * multipart/form-data
 * file: image (optionnel)
 */
router.put(

    "/:id",

    authenticate,

    isAdmin,

    upload.single("image"),

    controller.update

);







/**
 * Supprimer un projet
 *
 * DELETE /projets/:id
 */
router.delete(

    "/:id",

    authenticate,

    isAdmin,

    controller.remove

);






module.exports =
router;