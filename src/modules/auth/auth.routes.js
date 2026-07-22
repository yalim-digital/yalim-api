const express = require('express');

const router = express.Router();

const controller =
    require('./auth.controller');

const validate =
require('../../middlewares/validation.middleware');

const {
    isAdmin
} =
    require('../../middlewares/role.middleware');

const {
    registerSchema
} = require('./auth.validation');

router.post(
    '/login',
    controller.login
);

const {
    authenticate
} = require(
    '../../middlewares/auth.middleware'
);

router.get(

    "/admin",

    authenticate,

    isAdmin,

    controller.findAllAdmin

);
router.get(
    '/me',
    authenticate,
    controller.me
);

const upload =
    require(
        '../../middlewares/upload.middleware'
    );

router.post(
    '/register',
    upload.single(
        'photo_identite'
    ),
    validate(registerSchema),
    controller.register
);

router.put(
  "/profile-photo",
  authenticate,
  upload.single("photo_identite"),
  controller.updateProfilePhoto
);

router.put(
  "/password-update",
  authenticate,
  controller.updatePassword
);

router.post(
  "/active",
  
  authenticate,
  isAdmin,
  controller.activeMembre
);

router.post(
  "/desactive",
  
  authenticate,
  isAdmin,
  controller.desactiveMembre
);

module.exports = router;