const express = require('express');
const router = express.Router();

const controller = require('./homeCta.controller');

const upload = require('../../middlewares/upload.middleware');
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
 * ADMIN CREATE
 */
router.post(
    "/",
    authenticate,
    isAdmin,
    upload.single("image"),
    controller.create
);

/**
 * ADMIN UPDATE
 */
router.put(
    "/",
    authenticate,
    isAdmin,
    upload.single("image"),
    controller.update
);

module.exports = router;