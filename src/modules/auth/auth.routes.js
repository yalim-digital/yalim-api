const express = require('express');

const router = express.Router();

const controller =
    require('./auth.controller');

const validate =
require('../../middlewares/validation.middleware');

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

module.exports = router;