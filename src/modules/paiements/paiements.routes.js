const express =
require('express');


const router =
express.Router();



const controller =
require('./paiements.controller');



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
 * MEMBRE
 * ======================================
 */



/**
 * Créer un paiement
 *
 * POST /paiements
 *
 * multipart/form-data
 *
 * preuve : image
 */
router.post(

    "/",

    authenticate,

    upload.single(
        "preuve"
    ),

    controller.create

);







/**
 * Mes paiements
 *
 * GET /paiements/mes-paiements
 */
router.get(

    "/mes-paiements",

    authenticate,

    controller.getMyPayments

);







/**
 * Détail paiement
 *
 * GET /paiements/:id
 */
router.get(

    "/:id",

    authenticate,

    controller.getById

);









/**
 * ======================================
 * ADMIN
 * ======================================
 */



/**
 * Liste tous les paiements
 *
 * GET /paiements
 */
router.get(

    "/",

    authenticate,

    isAdmin,

    controller.getAll

);







/**
 * Valider paiement
 *
 * PUT /paiements/:id/valider
 */
router.put(

    "/:id/valider",

    authenticate,

    isAdmin,

    controller.validate

);







/**
 * Refuser paiement
 *
 * PUT /paiements/:id/refuser
 */
router.put(

    "/:id/refuser",

    authenticate,

    isAdmin,

    controller.refuse

);






module.exports = router;