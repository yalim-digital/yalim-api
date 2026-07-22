const express = require('express');
const router = express.Router();

const controller = require('./settings.controller');

const { authenticate } = require('../../middlewares/auth.middleware');
const { isAdmin } = require('../../middlewares/role.middleware');

/**
 * PUBLIC
 */
router.get(
    "/",
    controller.get
);



/**
 * ADMIN UPDATE
 */
router.put(
    "/",
    authenticate,
    isAdmin,
    controller.update
);

module.exports = router;