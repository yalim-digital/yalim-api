

// const nodemailer = require('nodemailer');


// import { BrevoClient } from '@getbrevo/brevo';
const BrevoClient = require('@getbrevo/brevo');
const dotenv = require('dotenv');

dotenv.config();
const brevo = new BrevoClient.BrevoClient({ apiKey: process.env.BREVO_API_KEY,  timeoutInSeconds: 30,
  maxRetries: 3, });
const sendActivationEmail = async (
    adminEmail,
    membre,
    activationLink
) => {
    await brevo.transactionalEmails.sendTransacEmail({
  subject: "Nouvelle demande d'adhésion",
  htmlContent: `
        <h3>Nouvelle demande membre</h3>

        <p>
            ${membre.nom_complet}
            (${membre.email})
        </p>

        <p>
            <a href="${activationLink}">
                Activer ce membre
            </a>
        </p>
    `,
  sender: { name: 'IDEM Planet', email: 'lyiamdev8@gmail.com' },
  to: [{ email: adminEmail, name: 'Mahaiavy' }],
});
}


// const transporter = nodemailer.createTransport({
//     host: 'smtp-relay.brevo.com',
//     port: 587,
//     secure: false,
//     auth: {
//         user: process.env.BREVO_LOGIN,
//         pass: process.env.BREVO_API_KEY
//     }
// });

// module.exports = transporter;

// const brevo = require('@getbrevo/brevo');

// const apiInstance = new brevo.TransactionalEmailsApi();

// apiInstance.setApiKey(
//     brevo.TransactionalEmailsApiApiKeys.apiKey,
//     process.env.BREVO_API_KEY
// );

// const sendActivationEmail = async (
//     adminEmail,
//     membre,
//     activationLink
// ) => {

//     const sendSmtpEmail = new brevo.SendSmtpEmail();

//     sendSmtpEmail.subject =
//         "Nouvelle demande d'adhésion";

//     sendSmtpEmail.htmlContent = `
//         <h3>Nouvelle demande membre</h3>

//         <p>
//             ${membre.nom_complet}
//             (${membre.email})
//         </p>

//         <p>
//             <a href="${activationLink}">
//                 Activer ce membre
//             </a>
//         </p>
//     `;

//     sendSmtpEmail.sender = {
//         name: 'IDEM PLANET',
//         email: 'lyiamdev8@gmail.com'
//     };

//     sendSmtpEmail.to = [
//         {
//             email: adminEmail
//         }
//     ];

//     return await apiInstance.sendTransacEmail( 
//         sendSmtpEmail
//     );
// };

module.exports = {
    sendActivationEmail
};