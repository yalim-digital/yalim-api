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

router.post(
    '/register',
    validate(registerSchema),
    controller.register
);

module.exports = router;