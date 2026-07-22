const express = require('express');
const router = express.Router();

const controller = require('./partenaires.controller');

const upload = require('../../middlewares/upload.middleware');
const { authenticate } = require('../../middlewares/auth.middleware');
const { isAdmin } = require('../../middlewares/role.middleware');

/**
 * PUBLIC
 */
router.get(
    "/",
    controller.getAll
);

/**
 * ADMIN
 */
router.post(
    "/",
    authenticate,
    isAdmin,
    upload.single("logo"),
    controller.create
);

router.put(
    "/:id",
    authenticate,
    isAdmin,
    upload.single("logo"),
    controller.update
);

router.delete(
    "/:id",
    authenticate,
    isAdmin,
    controller.remove
);

module.exports = router;