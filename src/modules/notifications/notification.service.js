// services/notificationService.js

const notificationRepository = require("./notification.repository");
const membreRepository = require("../auth/auth.repository");
const webpush = require("../../services/webPush.service");
const pushSubscription = require("./pushSubscription.repository");

const {
    getIO
} = require("../../sockets/reunion.socket");



/**
 * Notifier un membre
 */
const notifyMember = async ({
    membre_id,
    titre,
    message,
    type,
    reference_id = null,
    lien = null
}) => {


    const notification =
        await notificationRepository.create({
            membre_id,
            titre,
            message,
            type,
            reference_id,
            lien
        });



    const io = getIO();


    io.to(
        `member_${membre_id}`
    )
    .emit(
        "new_notification",
        notification
    );



    return notification;

};





/**
 * Notifier plusieurs membres
 */
const notifyMembers = async (
    membreIds,
    notification
) => {


    const notifications =
        membreIds.map(
            membre_id => ({

                membre_id,

                titre:
                    notification.titre,

                 title:
                    notification.titre,

                message:
                    notification.message,

                type:
                    notification.type,

                reference_id:
                    notification.reference_id || null,

                lien:
                    notification.lien || null

            })
        );



    const result =
        await notificationRepository.createMany(
            notifications
        );



    const io = getIO();



    notifications.forEach(
        async(notif)=>{

            await sendPushNotification(
                notif.membre_id,
                notif
            );


            io.to(
                `member_${notif.membre_id}`
            )
            .emit(
                "new_notification",
                {
                    ...notif,
                    created_at:new Date()
                }
            );


        }
    );



    return result;

};





/**
 * Notifier tous les membres
 */
const notifyAllMembers = async (
    notification
) => {


    const membres =
        await membreRepository.findAll();



    const membreIds =
        membres.map(
            membre => membre.id
        );



    return await notifyMembers(
        membreIds,
        notification
    );

};

const notifyAdmin = async (
    notification
) => {


    const membres =
        await membreRepository.findAdmin();



    const membreIds =
        membres.map(
            membre => membre.id
        );



    return await notifyMembers(
        membreIds,
        notification
    );

};

const notifyOneMember = async (
    notification,id
) => {


    const membres =
        await membreRepository.findById(id);



    const membreIds = [membres.id];



    return await notifyMembers(
        membreIds,
        notification
    );

};



const sendPushNotification = async (
    membre_id,
    notification
) => {

    const subscriptions =
        await pushSubscription.findByMember(
            membre_id
        );

    for (const sub of subscriptions) {

        const pushSubscription = {

            endpoint: sub.endpoint,

            keys: {

                p256dh: sub.p256dh,

                auth: sub.auth

            }

        };

        try {

            await webpush.sendNotification(

                pushSubscription,

                JSON.stringify({

                    title: "IDEM PLANET",
                    titre: "IDEM Planet",
                    image: "https://idem-planet.netlify.app/assets/idemlogo-DHmsY4XE.png",
                    icon: "https://idem-planet.netlify.app/assets/idemlogo-DHmsY4XE.png",
                    badge: "https://idem-planet.netlify.app/assets/idemlogo-DHmsY4XE.png",
                    icone: "https://idem-planet.netlify.app/assets/idemlogo-DHmsY4XE.png",

                    message: notification.message,

                    type: notification.type,

                    lien: notification.lien

                })

            );

        } catch (error) {

            console.error(
                "Erreur Push :",
                error.message
            );

        }

    }

};

module.exports = {
    notifyMember,
    notifyMembers,
    notifyAllMembers,
    sendPushNotification,
    notifyAdmin,
    notifyOneMember
};