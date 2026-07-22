const express = require('express');

const router = express.Router();


const controller =
    require('./publications.controller');



const validate =
    require('../../middlewares/validation.middleware');


const {
    authenticate
} =
    require('../../middlewares/auth.middleware');


const {
    isAdmin
} =
    require('../../middlewares/role.middleware');


const upload =
    require('../../middlewares/upload.middleware');

/**
 * Liste publications
 *
 * GET /api/publications?page=1&limit=10
 *
 */
router.get(
    '/',
    authenticate,
    controller.getAll
);






/**
 * Détail publication
 *
 * GET /api/publications/:id
 *
 */
router.get(
    '/:id',
    authenticate,
    controller.getById
);








/**
 * Création publication
 *
 * POST /api/publications
 *
 * FormData :
 * contenu
 * image
 *
 */
router.post(

    '/',

    authenticate,

    isAdmin,

    upload.single(
        "image"
    ),

    controller.create

);








/**
 * Modification publication
 *
 * PUT /api/publications/:id
 *
 */
router.put(

    '/:id',

    authenticate,

    isAdmin,

    upload.single(
        "image"
    ),

    controller.update

);








/**
 * Suppression publication
 *
 * DELETE /api/publications/:id
 *
 */
router.delete(

    '/:id',

    authenticate,

    isAdmin,

    controller.remove

);






module.exports = router;