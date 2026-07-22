const express =
require('express');


const router =
express.Router();




const controller =
require('./homeStats.controller');




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
 * Liste des chiffres clés actifs
 *
 * GET /home-stats
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
 * Liste tous les chiffres
 *
 * GET /home-stats/admin
 */
router.get(

    "/admin",

    authenticate,

    isAdmin,

    controller.getAll

);







/**
 * Détail chiffre clé
 *
 * GET /home-stats/:id
 */
router.get(

    "/:id",

    authenticate,

    isAdmin,

    controller.getById

);







/**
 * Créer un chiffre clé
 *
 * POST /home-stats
 */
router.post(

    "/",

    authenticate,

    isAdmin,

    controller.create

);







/**
 * Modifier un chiffre clé
 *
 * PUT /home-stats/:id
 */
router.put(

    "/:id",

    authenticate,

    isAdmin,

    controller.update

);







/**
 * Supprimer un chiffre clé
 *
 * DELETE /home-stats/:id
 */
router.delete(

    "/:id",

    authenticate,

    isAdmin,

    controller.remove

);






module.exports =
router;