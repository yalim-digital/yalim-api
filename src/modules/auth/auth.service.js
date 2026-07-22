const bcrypt = require('bcrypt');
require('dotenv').config();

const repository = require('./auth.repository');
const { v4: uuidv4 } = require('uuid');
// const transporter = require('../../config/mailer');
const {
    sendActivationEmail
} = require('../../config/mailer');

const { generateToken } =
    require('../../utils/jwt');
const generateMatricule =
require('../../utils/matricule');

// const {
//     notifyAdmins,
//     notifyMember
// } = require('../../services/notification.service');
const notificationService =
    require('../notifications/notification.service');

const getMe = async (userId) => {
  const user = await repository.findById(userId);
    console.log(userId);
  if (!user) {
    console.log(userId);
    throw new Error("Utilisateur introuvable"+userId);
  }

  return {
    id: user.id,
    matricule: user.matricule,
    nom_complet: user.nom_complet,
    email: user.email,
    telephone: user.telephone,
    mention: user.mention,
    parcours: user.parcours,
    niveau: user.niveau,
    date_naissance: user.date_naissance,
    sexe: user.sexe,
    cin: user.cin,
    statut: user.statut,
    type_membre: user.type_membre,
    role: user.role,
    is_active: user.is_active,
    note: user.note,
    active_par: user.active_par,
    photo_identite: user.photo_identite,
    photo_url: user.photo_identite
  ? `${process.env.BASE_URL}/uploads/${user.photo_identite}`
  : null,
    created_at: user.created_at
  };
};

const register = async (data) => {

    

    const existingUser =
        await repository.findByEmail(
            data.email
        );

    if (existingUser) {

        throw new Error(
            'Cet email existe déjà'
        );

    }

    const hashedPassword =
        await bcrypt.hash(
            data.password,
            10
        );

        const member = {

            matricule:
                generateMatricule(),

            nom_complet:
                data.nom_complet,

            email:
                data.email,

            telephone:
                data.telephone,

            mention:
                data.mention,

            parcours:
                data.parcours,

            niveau:
                data.niveau,

            date_naissance:
                data.date_naissance,

            photo_identite:
                data.photo_identite,

            sexe:
                data.sexe,

            cin:
                data.cin,

            mot_de_passe:
                hashedPassword,

            statut:
                'inactif',

            type_membre:
                data.type_membre,

            role:
                'membre',
            is_active: 1
        };

    const id =
        await repository.create(
            member
        );

    const new_member =
        await repository.findById(
            id
        );

    const link = `${process.env.BASE_URL}/api/adhesion/activate/${new_member.matricule}`;
        // 3. email admin
        // await transporter.sendMail({
        //     from: '"IDEM PLANET" <lyiamdev8@gmail.com>',
        //     to: process.env.ADMIN_EMAIL,
        //     subject: "Nouvelle demande d'adhésion",
        //     html: `
        //         <h3>Nouvelle demande membre</h3>
        //         <p>${data.nom_complet} (${data.email})</p>
        //         <a href="${link}">Activer ce membre</a>
        //     `
        // });
    await sendActivationEmail(
        process.env.ADMIN_EMAIL, 
        data,
        link
    );

                // 4. notification socket admin (temps réel)
        notificationService.notifyAdmin({
        
                    membre_id:new_member.id,
        
                    titre: "Demande d'adhésion",
        
                    title: "Demande d'adhésion",
        
                    message: new_member.firstname+" a demandé de joindre l'IDEM Planéte.",
        
                    type: "adhésion",
        
                    reference_id:null,
        
                    lien: null
        
                })

        notificationService.notifyOneMember({
        
                    membre_id:new_member.id,
        
                    titre: "Demande d'adhésion",
        
                    title: "Demande d'adhésion",
        
                    message: "Votre demande d'adhésion a été envoyée,vous recevrez de notification et email après la validation.",
        
                    type: "adhésion",
        
                    reference_id:null,
        
                    lien: null
        
                },new_member.id)
      

    return {
        id,
        message:
            'Inscription effectuée avec succès'
    };
};

const login = async (
    email,
    password
) => {

    const user =
        await repository.findByEmail(email);

    if (!user) {
        throw new Error(
            'Email ou mot de passe incorrect'
        );
    }

    const valid =
        await bcrypt.compare(
            password,
            user.mot_de_passe
        );

    if (!valid) {
        throw new Error(
            'Email ou mot de passe incorrect'
        );
    }

    if (Number(user.is_active ) !== 1) {

        throw new Error(
            'Votre compte est en attente de validation'
        );

    }

    const token =
        generateToken(user);
           
    return {
        token,
        user: {
            id: user.id,
            nom_complet: user.nom_complet,
            email: user.email,
            matricule: user.matricule,
                        telephone: user.telephone,
            mention: user.mention,
                        parcours: user.parcours,
            niveau: user.niveau,
                        email: user.email,
            date_naissance: user.date_naissance,
                        photo_identite: user.photo_identite,
            sexe: user.sexe,
                        email: user.email,
            cin: user.cin,
                        email: user.email,
            type_membre: user.type_membre,
            created_at:user.created_at,
            role: user.role,
            statut: user.statut,
            note: user.note
        }
    };
};

const updatePhoto = async (
  userId,
  data
) => {

  const response = await repository.updateProfil(
    userId,data.photo_identite
  );

  const userConnected=await getMe(userId);

  return {
    ...response,
    user: userConnected
  };

};

const updatePassword = async (
  userId,
  photo_identite
) => {

  const hashedPassword =
        await bcrypt.hash(
            photo_identite,
            10
        );


  const response = await repository.updatePassword(
    userId,hashedPassword
  );

  const userConnected=await getMe(userId);

  return {
    ...response,
    user: userConnected
  };

};

const activeMembre = async (
  userId,active_par
) => {

  


  const response = await repository.update(
    userId,{is_active:1,active_par:active_par}
  );

  const userConnected=await getMe(userId);

    notificationService.notifyOneMember({

            membre_id:userId,

            titre: "Compte Activé",

            title: "Compte Activé",

            message: "Votre compte a été activé.",

            type: "adhésion",

            reference_id:null,

            lien: null

        },userId)

  return {
    ...response,
    user: userConnected
  };

};

const desactiveMembre = async (
  userId,active_par
) => {

  


  const response = await repository.update(
    userId,{is_active:2,active_par:active_par}
  );

  const userConnected=await getMe(userId);

     notificationService.notifyOneMember({

            membre_id:userId,

            titre: "Compte Desactivé ou Refusé",

            title: "Compte Desactivé ou Refusé",

            message: "Votre compte a été desactivé ou refusé,veuillez contactez l'admin pour la raison.",

            type: "adhésion",

            reference_id:null,

            lien: null

        },userId)

  return {
    ...response,
    user: userConnected
  };

};

/**
 * LISTE ADMIN
 * avec filtres + pagination
 */
const findAllAdmin = async(filters)=>{


    const data =
        await repository.findAllAdmin(
            filters
        );



    const total =
        await repository.countAll(
            filters
        );



    const page =
        Math.floor(
            filters.offset / filters.limit
        )
        +
        1;



    return {

        data,


        pagination:{

            page,

            limit:
                Number(filters.limit),

            total,

            pages:
                Math.ceil(
                    total /
                    Number(filters.limit)
                )

        }

    };


};





module.exports = {
    login,
    register,
    getMe,
    updatePhoto,
    updatePassword,
    activeMembre,
    desactiveMembre,
    findAllAdmin
};