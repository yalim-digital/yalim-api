// routes/notificationRoutes.js

const express = require("express");

const router = express.Router();


const controller =
    require("./notification.controller");


// Middleware auth existant
const {
    authenticate
} =
require('../../middlewares/auth.middleware');





router.get(
    "/",
    authenticate,
    controller.getNotifications
);


router.get(
    "/unread-count",
    authenticate,
    controller.getUnreadCount
);



router.patch(
    "/:id/read",
    authenticate,
    controller.markAsRead
);



router.patch(
    "/read-all",
    authenticate,
    controller.markAllAsRead
);



router.delete(
    "/:id",
    authenticate,
    controller.remove
);

router.post(
    "/subscribe",
    authenticate,
    controller.subscribe
);

module.exports = router;