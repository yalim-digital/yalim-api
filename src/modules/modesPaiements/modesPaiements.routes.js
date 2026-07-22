const express =
require('express');


const router =
express.Router();



const controller =
require('./modesPaiements.controller');



const {
    authenticate
} =
    require('../../middlewares/auth.middleware');


const {
    isAdmin
} =
    require('../../middlewares/role.middleware');






/**
 * Liste des modes
 *
 * Admin uniquement
 */
router.get(

    '/',

    authenticate,

    controller.getAll

);







/**
 * Détail mode paiement
 */
router.get(

    '/:id',

    authenticate,

    isAdmin,

    controller.getById

);








/**
 * Création
 */
router.post(

    '/',

    authenticate,

    isAdmin,

    controller.create

);








/**
 * Modification
 */
router.put(

    '/:id',

    authenticate,

    isAdmin,

    controller.update

);








/**
 * Désactivation
 */
router.delete(

    '/:id',

    authenticate,

    isAdmin,

    controller.remove

);






module.exports = router;