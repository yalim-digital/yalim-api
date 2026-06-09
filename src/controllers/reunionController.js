const db = require('../config/database');

// Lancer une réunion
const lancerReunion = (req, res) => {
    const { titre, description, date_reunion } = req.body;
    const admin_id = req.user.id;

    const sql = `INSERT INTO reunions (admin_id, titre, description, date_reunion, statut) 
                VALUES (?, ?, ?, ?, 'en cours')`;

    db.query(sql, [admin_id, titre, description, date_reunion || new Date()], (err, result) => {
        if (err) {
            console.error('Erreur création réunion:', err);
            return res.status(500).json({ message: '❌ Erreur création réunion', error: err });
        }

        const reunion_id = result.insertId;

        // Notifier tous les membres actifs
        db.query('SELECT id FROM membres WHERE deleted_at IS NULL AND statut = "actif" AND role = "membre"', (err, membres) => {
            if (err) return res.status(500).json({ message: '❌ Erreur notification' });

            membres.forEach(membre => {
                db.query(
                    'INSERT INTO notifications (membre_id, titre, message, type) VALUES (?, ?, ?, ?)',
                    [membre.id, '📹 Nouvelle Réunion !', `Une réunion "${titre}" vient d'être lancée !`, 'reunion']
                );
            });

            res.status(201).json({ 
                message: '✅ Réunion lancée avec succès !',
                reunion_id 
            });
        });
    });
};

// Obtenir toutes les réunions (avec le nom de l'admin depuis la table membres)
const getToutesReunions = (req, res) => {
    const sql = `SELECT r.*, m.nom_complet as admin_nom 
                FROM reunions r
                JOIN membres m ON r.admin_id = m.id
                WHERE r.deleted_at IS NULL 
                ORDER BY r.created_at DESC`;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erreur get réunions:', err);
            return res.status(500).json({ message: '❌ Erreur serveur', error: err });
        }
        res.json({ reunions: results });
    });
};

// Obtenir réunion active
const getReunionActive = (req, res) => {
    const sql = `SELECT * FROM reunions WHERE statut = 'en cours' AND deleted_at IS NULL LIMIT 1`;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erreur get réunion active:', err);
            return res.status(500).json({ message: '❌ Erreur serveur', error: err });
        }
        if (results.length === 0) return res.json({ reunion: null });
        res.json({ reunion: results[0] });
    });
};

// Terminer une réunion
const terminerReunion = (req, res) => {
    const { id } = req.params;
    const sql = `UPDATE reunions SET statut = 'terminée' WHERE id = ?`;

    db.query(sql, [id], (err) => {
        if (err) {
            console.error('Erreur terminer réunion:', err);
            return res.status(500).json({ message: '❌ Erreur serveur', error: err });
        }
        res.json({ message: '✅ Réunion terminée avec succès !' });
    });
};

// Supprimer une réunion (corbeille)
const supprimerReunion = (req, res) => {
    const { id } = req.params;

    db.query('SELECT * FROM reunions WHERE id = ? AND deleted_at IS NULL', [id], (err, results) => {
        if (err) {
            console.error('Erreur select réunion:', err);
            return res.status(500).json({ message: '❌ Erreur serveur' });
        }
        if (results.length === 0) return res.status(404).json({ message: '❌ Réunion non trouvée' });

        const reunion = results[0];
        const expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        db.query(
            'INSERT INTO corbeille (table_origine, element_id, donnees, expires_at) VALUES (?, ?, ?, ?)',
            ['reunions', id, JSON.stringify(reunion), expires_at],
            (err) => {
                if (err) {
                    console.error('Erreur insertion corbeille:', err);
                    return res.status(500).json({ message: '❌ Erreur corbeille' });
                }
                db.query('UPDATE reunions SET deleted_at = NOW() WHERE id = ?', [id], (err) => {
                    if (err) {
                        console.error('Erreur soft delete:', err);
                        return res.status(500).json({ message: '❌ Erreur suppression' });
                    }
                    res.json({ message: '✅ Réunion supprimée — disponible dans la corbeille 30 jours' });
                });
            }
        );
    });
};

module.exports = {
    lancerReunion,
    getToutesReunions,
    getReunionActive,
    terminerReunion,
    supprimerReunion
};