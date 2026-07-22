const express =
require('express');


const router =
express.Router();



const controller =
require('./homeHero.controller');



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
 * Récupérer le Hero
 *
 * GET /home-hero
 */
router.get(

    "/",

    controller.get

);









/**
 * ======================================
 * ADMIN
 * ======================================
 */





/**
 * Modifier le Hero
 *
 * PUT /home-hero
 *
 * multipart/form-data
 *
 * image : fichier image
 */
router.put(

    "/",

    authenticate,

    isAdmin,


    upload.single(
        "image"
    ),


    controller.update

);







module.exports =
router;