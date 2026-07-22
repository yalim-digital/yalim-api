const express =
require('express');


const router =
express.Router();




const controller =
require('./impacts.controller');




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
 * Liste des impacts actifs
 *
 * GET /impacts
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
 * Liste tous les impacts
 *
 * GET /impacts/admin
 */
router.get(

    "/admin",

    authenticate,

    isAdmin,

    controller.getAll

);







/**
 * Détail impact
 *
 * GET /impacts/:id
 */
router.get(

    "/:id",

    authenticate,

    isAdmin,

    controller.getById

);







/**
 * Créer un impact
 *
 * POST /impacts
 */
router.post(

    "/",

    authenticate,

    isAdmin,

    controller.create

);







/**
 * Modifier un impact
 *
 * PUT /impacts/:id
 */
router.put(

    "/:id",

    authenticate,

    isAdmin,

    controller.update

);







/**
 * Supprimer un impact
 *
 * DELETE /impacts/:id
 */
router.delete(

    "/:id",

    authenticate,

    isAdmin,

    controller.remove

);






module.exports =
router;