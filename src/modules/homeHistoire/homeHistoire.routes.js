const express =
require('express');


const router =
express.Router();




const controller =
require('./homeHistoire.controller');



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
 * Récupérer l'histoire
 *
 * GET /home-histoire
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
 * Modifier l'histoire
 *
 * PUT /home-histoire
 */
router.put(

    "/",

    authenticate,

    isAdmin,
    controller.update

);






module.exports =
router;