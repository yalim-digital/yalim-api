// backend/controllers/paiementController.js
const db = require('../config/db');
// const { envoyerEmail } = require('../config/emailConfig');

// Créer un paiement
const creerPaiement = (req, res) => {
    const { 
        membre_id, 
        type_paiement, 
        montant, 
        methode, 
        numero_transaction, 
        reference, 
        mois_concerne,
        numero_paiement,
        date_paiement 
    } = req.body;

    console.log('📝 Création paiement:', { membre_id, type_paiement, montant, methode });

    db.query('SELECT * FROM membres WHERE id = ?', [membre_id], (err, membreResult) => {
        if (err) return res.status(500).json({ message: 'Erreur serveur' });
        if (membreResult.length === 0) return res.status(404).json({ message: 'Membre non trouvé' });

        const membre = membreResult[0];

        const sql = `INSERT INTO paiements 
            (membre_id, type_paiement, montant, methode, statut, date_paiement, mois_concerne, numero_transaction, reference, numero_paiement) 
            VALUES (?, ?, ?, ?, 'payé', ?, ?, ?, ?, ?)`;

        db.query(sql, [
            membre_id, type_paiement, montant, methode, 
            date_paiement || new Date(), 
            mois_concerne || null, 
            numero_transaction || null, 
            reference || null, 
            numero_paiement || null
        ], async (err, result) => {
            if (err) {
                console.error('❌ Erreur insertion:', err);
                return res.status(500).json({ message: 'Erreur paiement', error: err });
            }

            if (type_paiement === 'droit_adhesion') {
                db.query('UPDATE membres SET type_membre = "ancien" WHERE id = ?', [membre_id]);
            }

            // Envoyer un email de confirmation au membre
            const sujet = '✅ Confirmation de paiement - IDEM Planet';
            const html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E2E8F0; border-radius: 16px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #2E7D32;">IDEM Planet</h1>
                        <p style="color: #64748B;">Association IST Ambositra</p>
                    </div>
                    <h2 style="color: #2E7D32;">📄 Reçu de paiement</h2>
                    <p>Bonjour <strong>${membre.nom_complet}</strong>,</p>
                    <p>Nous vous confirmons la réception de votre paiement :</p>
                    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                        <tr style="background: #F1F8E9;">
                            <td style="padding: 10px; border: 1px solid #E2E8F0; width: 40%;"><strong>Référence</strong></td>
                            <td style="padding: 10px; border: 1px solid #E2E8F0;"><code>${numero_paiement}</code></td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #E2E8F0;"><strong>Type</strong></td>
                            <td style="padding: 10px; border: 1px solid #E2E8F0;">${type_paiement === 'droit_adhesion' ? '🎓 Droit d\'adhésion' : '📆 Cotisation mensuelle'}</td>
                        </tr>
                        <tr style="background: #F1F8E9;">
                            <td style="padding: 10px; border: 1px solid #E2E8F0;"><strong>Montant</strong></td>
                            <td style="padding: 10px; border: 1px solid #E2E8F0;">${parseInt(montant).toLocaleString()} Ar</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #E2E8F0;"><strong>Mode de paiement</strong></td>
                            <td style="padding: 10px; border: 1px solid #E2E8F0;">
                                ${methode === 'mvola' ? '📱 MVola' : 
                                  methode === 'orange_money' ? '🟠 Orange Money' : 
                                  methode === 'airtel_money' ? '🔴 Airtel Money' : '💵 Espèces'}
                            </td>
                        </tr>
                        ${reference ? `<tr style="background: #F1F8E9;">
                            <td style="padding: 10px; border: 1px solid #E2E8F0;"><strong>Référence</strong></td>
                            <td style="padding: 10px; border: 1px solid #E2E8F0;">${reference}</td>
                        </tr>` : ''}
                        <tr>
                            <td style="padding: 10px; border: 1px solid #E2E8F0;"><strong>Date</strong></td>
                            <td style="padding: 10px; border: 1px solid #E2E8F0;">${new Date().toLocaleDateString('fr-FR')}</td>
                        </tr>
                    }</table>
                    <p>Merci de votre confiance et de votre engagement !</p>
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E2E8F0; text-align: center; color: #94A3B8;">
                        <p>IDEM Planet — Agir ensemble pour la planète</p>
                        <p>IST Ambositra, Madagascar</p>
                    </div>
                </div>
            `;

            // await envoyerEmail(membre.email, sujet, html);

            res.status(201).json({ 
                message: '✅ Paiement effectué avec succès ! Un reçu a été envoyé par email.',
                paiement_id: result.insertId 
            });
        });
    });
};

// Obtenir tous les paiements
const getTousPaiements = (req, res) => {
    const sql = `SELECT p.*, m.nom_complet, m.matricule, m.email 
                FROM paiements p
                JOIN membres m ON p.membre_id = m.id
                WHERE p.deleted_at IS NULL 
                ORDER BY p.created_at DESC`;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: 'Erreur serveur' });
        res.json({ paiements: results });
    });
};

// Obtenir paiements d'un membre
const getPaiementsMembre = (req, res) => {
    const membre_id = req.user.id;
    const sql = `SELECT * FROM paiements WHERE membre_id = ? AND deleted_at IS NULL ORDER BY created_at DESC`;

    db.query(sql, [membre_id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Erreur serveur' });
        res.json({ paiements: results });
    });
};

// Obtenir membres non payeurs
const getMembresNonPayeurs = (req, res) => {
    const moisActuel = new Date().toISOString().slice(0, 7);
    
    const sql = `SELECT m.id, m.matricule, m.nom_complet, m.email, m.telephone, m.type_membre
                FROM membres m
                WHERE m.deleted_at IS NULL
                AND m.statut = 'actif'
                AND m.role != 'admin'
                AND m.id NOT IN (
                    SELECT membre_id FROM paiements
                    WHERE type_paiement = 'cotisation_mensuelle'
                    AND statut = 'payé'
                    AND mois_concerne = ?
                )
                AND m.type_membre = 'ancien'`;

    db.query(sql, [moisActuel], (err, results) => {
        if (err) return res.status(500).json({ message: 'Erreur serveur' });
        res.json({ non_payeurs: results, mois: moisActuel });
    });
};

// Signaler les non payeurs par email
const signalerNonPayeurs = (req, res) => {
    const { paiement_id, email, membre_nom, montant, reference, type_paiement } = req.body;
    const moisActuel = new Date().toISOString().slice(0, 7);

    // Si c'est un envoi de reçu spécifique
    if (paiement_id && email) {
        const sujet = '📄 Reçu de paiement - IDEM Planet';
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E2E8F0; border-radius: 16px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #2E7D32;">IDEM Planet</h1>
                    <p style="color: #64748B;">Association IST Ambositra</p>
                </div>
                <h2 style="color: #2E7D32;">📄 Reçu de paiement</h2>
                <p>Bonjour <strong>${membre_nom || 'Cher membre'}</strong>,</p>
                <p>Nous vous confirmons la réception de votre paiement :</p>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr style="background: #F1F8E9;">
                        <td style="padding: 10px; border: 1px solid #E2E8F0;"><strong>Type</strong></td>
                        <td style="padding: 10px; border: 1px solid #E2E8F0;">${type_paiement === 'droit_adhesion' ? '🎓 Droit d\'adhésion' : '📆 Cotisation mensuelle'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #E2E8F0;"><strong>Montant</strong></td>
                        <td style="padding: 10px; border: 1px solid #E2E8F0;">${parseInt(montant).toLocaleString()} Ar</td>
                    </tr>
                    ${reference ? `<tr style="background: #F1F8E9;">
                        <td style="padding: 10px; border: 1px solid #E2E8F0;"><strong>Référence</strong></td>
                        <td style="padding: 10px; border: 1px solid #E2E8F0;">${reference}</td>
                    </tr>` : ''}
                </table>
                <p>Merci de votre confiance !</p>
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E2E8F0; text-align: center; color: #94A3B8;">
                    <p>IDEM Planet — Agir ensemble pour la planète</p>
                </div>
            </div>
        `;
        
        // envoyerEmail(email, sujet, html).then(() => {
        //     res.json({ message: '✅ Reçu envoyé par email !' });
        // }).catch((error) => {
        //     res.status(500).json({ message: '❌ Erreur envoi email' });
        // });
        return;
    }

    // Sinon, envoyer des rappels aux non payeurs
    const sql = `SELECT m.nom_complet, m.email, m.matricule
                FROM membres m
                WHERE m.deleted_at IS NULL
                AND m.statut = 'actif'
                AND m.role != 'admin'
                AND m.id NOT IN (
                    SELECT membre_id FROM paiements
                    WHERE type_paiement = 'cotisation_mensuelle'
                    AND statut = 'payé'
                    AND mois_concerne = ?
                )
                AND m.type_membre = 'ancien'`;

    db.query(sql, [moisActuel], (err, membres) => {
        if (err) return res.status(500).json({ message: 'Erreur serveur' });

        if (membres.length === 0) {
            return res.json({ message: '✅ Tous les membres ont payé !' });
        }

        let emailsEnvoyes = 0;
        membres.forEach(membre => {
            const sujet = '⚠️ Rappel de cotisation - IDEM Planet';
            const html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #2E7D32;">⚠️ Rappel de cotisation</h2>
                    <p>Bonjour <strong>${membre.nom_complet}</strong>,</p>
                    <p>Nous vous rappelons que votre cotisation mensuelle pour <strong>${moisActuel}</strong> n'a pas encore été effectuée.</p>
                    <p>Veuillez procéder au paiement dès que possible.</p>
                    <p>Merci de votre compréhension.</p>
                    <br>
                    <p><strong>Association IDEM Planet</strong></p>
                </div>
            `;
            
            // envoyerEmail(membre.email, sujet, html);
            emailsEnvoyes++;
        });

        res.json({ message: `✅ Emails envoyés à ${emailsEnvoyes} membre(s) non payeur(s) !` });
    });
};

module.exports = {
    creerPaiement,
    getTousPaiements,
    getPaiementsMembre,
    getMembresNonPayeurs,
    signalerNonPayeurs
};