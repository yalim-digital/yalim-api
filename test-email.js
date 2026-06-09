const transporter = require('./src/config/mailer');

async function test() {
    try {
       const info= await transporter.sendMail({
            from: '"IDEM API" <lyiamdev8@gmail.com>',
            to: process.env.ADMIN_EMAIL,
            subject: "Test Brevo",
            html: "<h1>Email OK 🚀</h1>"
        });

        console.log("Email envoyé !");
        console.log(info);
    } catch (err) {
        console.log("Erreur:", err.message);
    }
}

test();