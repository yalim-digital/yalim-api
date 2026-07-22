const express =
    require('express');


const router =
    express.Router();



const likesController =
    require('./likes.controller');


const {
    authenticate
} =
    require('../../middlewares/auth.middleware');







/**
 * Toggle like publication
 *
 * POST
 * /api/publications/:id/like
 */
router.post(

    '/publications/:id/like/:membreId',

    authenticate,

    likesController.toggleLike

);







module.exports =
    router;