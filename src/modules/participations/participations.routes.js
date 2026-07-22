const express =
    require('express');

const router =
    express.Router();

const controller =
    require('./participations.controller');

const {
    authenticate
} = require(
    '../../middlewares/auth.middleware'
);
const {
    isAdmin
} =
    require('../../middlewares/role.middleware');

router.post(
    '/:activiteId',
    authenticate,
    controller.participate
);

router.delete(
    '/:activiteId',
    authenticate,
    controller.cancelParticipation
);

router.get(
    '/me',
    authenticate,
    controller.getMyParticipations
);

router.get(
    '/admin/:activiteId',
    authenticate,
    isAdmin,
    controller.getParticipantsAdmin
);


router.put(
    '/:id/valider',
    authenticate,
    isAdmin,
    controller.validateParticipation
);


router.put(
    '/:id/present',
    authenticate,
    isAdmin,
    controller.present
);


router.put(
    '/:id/absent',
    authenticate,
    isAdmin,
    controller.absent
);

router.get(
    "/:id/my-preview",
    authenticate,
    controller.getMyPreview
);

router.get(
    '/:id/qrcode',
    authenticate,
    controller.getQRCode
);

router.get(
    '/my-ids',
    authenticate,
    controller.myIds
);

router.post(
    '/checkin',
    authenticate,
    isAdmin,
    controller.checkin
);

router.post(
    "/scan-preview",
    authenticate,
    isAdmin,
    controller.scanPreview
);

// router.post(
//     "/scan-confirm",
//     authenticate,
//     isAdmin,
//     controller.scanConfirm
// );

module.exports = router;