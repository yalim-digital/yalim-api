const express =
require('express');


const router =
express.Router();



const controller =
require('./typesCotisations.controller');

const {
    authenticate
} =
    require('../../middlewares/auth.middleware');


const {
    isAdmin
} =
    require('../../middlewares/role.middleware');





/**
 * Public/authentifié
 * Liste des types actifs
 */
router.get(
    '/',
    authenticate,
    controller.getAll
);





router.get(
    '/:id',
    authenticate,
    controller.getById
);






/**
 * ADMIN ONLY
 */

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