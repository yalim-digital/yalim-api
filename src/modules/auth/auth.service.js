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

const {
    notifyAdmins,
    notifyMember
} = require('../../services/notification.service');

const getMe = async (userId) => {
  const user = await repository.findById(userId);

  if (!user) {
    throw new Error("Utilisateur introuvable");
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
                'actif',

            type_membre:
                data.type_membre,

            role:
                'membre'
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
        notifyAdmins(
            'admin:new_adhesion',
            {
                id: new_member.id,
                nom: new_member.nom_complet,
                email: new_member.email
            }
        );

        notifyMember(
            new_member.id,
            'member:pending',
            {
                message:
                     "Votre demande d'adhésion a été envoyée et attend la validation d'un administrateur."
            }
        );

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

    if (user.statut !== 'actif') {

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
            role: user.role,
            statut: user.statut
        }
    };
};

module.exports = {
    login,
    register,
    getMe
};