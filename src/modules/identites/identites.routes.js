const express =
require('express');


const router =
express.Router();




const controller =
require('./identites.controller');




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
 * Liste des identités actives
 *
 * GET /identites
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
 * GET /identites/admin
 */
router.get(

    "/admin",

    authenticate,

    isAdmin,

    controller.getAll

);







/**
 * Détail identité
 *
 * GET /identites/:id
 */
router.get(

    "/:id",

    authenticate,

    isAdmin,

    controller.getById

);







/**
 * Créer une identité
 *
 * POST /identites
 */
router.post(

    "/",

    authenticate,

    isAdmin,

    controller.create

);







/**
 * Modifier une identité
 *
 * PUT /identites/:id
 */
router.put(

    "/:id",

    authenticate,

    isAdmin,

    controller.update

);







/**
 * Supprimer une identité
 *
 * DELETE /identites/:id
 */
router.delete(

    "/:id",

    authenticate,

    isAdmin,

    controller.remove

);






module.exports =
router;