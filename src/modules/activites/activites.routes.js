const express =
    require('express');

const router =
    express.Router();


const controller =
    require('./activites.controller');


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


const {
    activiteSchema
} =
    require('./activites.validation');



// Membres
router.get(
    '/',
    controller.getAll
);


router.get(
    '/public',
    controller.getPublic
);

router.get(
    '/:id',
    controller.getById
);



// Admin
router.post(
    '/',
    authenticate,
    isAdmin,
    upload.single('image'),
    validate(activiteSchema),
    controller.create
);


router.put(
    '/:id',
    authenticate,
    isAdmin,
    upload.single('image'),
    validate(activiteSchema),
    controller.update
);


router.delete(
    '/:id',
    authenticate,
    isAdmin,
    controller.remove
);

router.get(
    '/next/:memberId',
    authenticate,
    controller.getNext
);


module.exports = router;