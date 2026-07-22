const express =
require('express');


const router =
express.Router();




const controller =
require('./timeline.controller');




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
 * Liste timeline active
 *
 * GET /timeline
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
 * Liste complète timeline
 *
 * GET /timeline/admin
 */
router.get(

    "/admin",

    authenticate,

    isAdmin,

    controller.getAll

);







/**
 * Détail timeline
 *
 * GET /timeline/:id
 */
router.get(

    "/:id",

    authenticate,

    isAdmin,

    controller.getById

);







/**
 * Créer un élément timeline
 *
 * POST /timeline
 */
router.post(

    "/",

    authenticate,

    isAdmin,

    controller.create

);







/**
 * Modifier un élément timeline
 *
 * PUT /timeline/:id
 */
router.put(

    "/:id",

    authenticate,

    isAdmin,

    controller.update

);







/**
 * Supprimer un élément timeline
 *
 * DELETE /timeline/:id
 */
router.delete(

    "/:id",

    authenticate,

    isAdmin,

    controller.remove

);






module.exports =
router;