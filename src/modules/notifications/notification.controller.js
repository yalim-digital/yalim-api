// controllers/notificationController.js

const notificationService =
    require("./notification.service");


const notificationRepository =
    require("./notification.repository");



/**
 * Liste des notifications du membre connecté
 */
const getNotifications = async (req, res)=>{

    try {


        const membre_id =
            req.user.id;



        const notifications =
            await notificationRepository.findByMember(
                membre_id
            );



        res.json({

            success:true,

            data:notifications

        });



    }
    catch(error){

        console.error(error);


        res.status(500).json({

            success:false,

            message:"Erreur récupération notifications"

        });

    }

};





/**
 * Nombre non lues
 */
const getUnreadCount = async (req,res)=>{

    try {


        const membre_id =
            req.user.id;



        const total =
            await notificationRepository.countUnread(
                membre_id
            );



        res.json({

            success:true,

            total

        });



    }
    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};





/**
 * Marquer une notification comme lue
 */
const markAsRead = async(req,res)=>{

    try {


        const membre_id =
            req.user.id;


        const {id} =
            req.params;



        await notificationRepository.markAsRead(
            id,
            membre_id
        );



        res.json({

            success:true,

            message:"Notification marquée comme lue"

        });



    }
    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }


};





/**
 * Tout marquer comme lu
 */
const markAllAsRead = async(req,res)=>{


    try {


        const membre_id =
            req.user.id;



        await notificationRepository.markAllAsRead(
            membre_id
        );



        res.json({

            success:true,

            message:"Toutes les notifications sont lues"

        });



    }
    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }


};





/**
 * Supprimer une notification
 */
const remove = async(req,res)=>{


    try {


        const membre_id =
            req.user.id;


        const {id} =
            req.params;



        await notificationRepository.remove(
            id,
            membre_id
        );



        res.json({

            success:true,

            message:"Notification supprimée"

        });


    }
    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }


};


const pushSubscriptionRepository =
require("./pushSubscription.repository");





const subscribe = async (
    req,
    res
)=>{


    try {


        const membre_id =
            req.user.id;



        const {
            endpoint,
            keys
        } = req.body;



        await pushSubscriptionRepository.create({

            membre_id,

            endpoint,

            p256dh:
                keys.p256dh,

            auth:
                keys.auth

        });



        return res.json({

            success:true,

            message:
            "Abonnement push enregistré"

        });



    } catch(error){


        console.error(error);


        return res.status(500).json({

            success:false,

            message:error.message

        });


    }


};





module.exports = {

    getNotifications,

    getUnreadCount,

    markAsRead,

    markAllAsRead,

    remove,
    subscribe

};