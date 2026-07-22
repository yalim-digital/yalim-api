const express =
require('express');


const router =
express.Router();



const controller =
require('./cotisations.controller');



const {
    authenticate
} =
    require('../../middlewares/auth.middleware');


const {
    isAdmin
} =
    require('../../middlewares/role.middleware');





/**
 * Membres authentifiés
 */

/*
Liste cotisations disponibles
pour paiement
*/
router.get(

    '/disponibles',

    authenticate,

    controller.getAvailable

);





/*
Détail cotisation
*/
router.get(

    '/disponibles/:id',

    authenticate,

    controller.getById

);








/**
 * Administration
 */



/*
Liste complète
*/
router.get(

    '/',

    authenticate,

    isAdmin,

    controller.getAll

);





router.post(

    '/',

    authenticate,

    isAdmin,

    controller.create

);





router.put(

    '/:id',

    authenticate,

    isAdmin,

    controller.update

);





router.delete(

    '/:id',

    authenticate,

    isAdmin,

    controller.remove

);






module.exports = router;