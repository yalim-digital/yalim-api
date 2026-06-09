const db = require('../config/db');

// Créer une publication
const creerPublication = (req, res) => {
    const { message } = req.body;
    const admin_id = req.user.id;
    const photo = req.file ? req.file.filename : null;

    const sql = `INSERT INTO publications (admin_id, message, photo) VALUES (?, ?, ?)`;
    db.query(sql, [admin_id, message, photo], (err, result) => {
        if (err) {
            console.error('Erreur création:', err);
            return res.status(500).json({ message: '❌ Erreur création', error: err });
        }
        res.status(201).json({ message: '✅ Publication créée avec succès !' });
    });
};

// Obtenir toutes les publications
const getToutesPublications = (req, res) => {
    // Correction: utiliser la table 'membres' au lieu de 'administrateur'
    const sql = `SELECT p.*, m.nom_complet as auteur, m.photo_identite as photo_profil 
                FROM publications p 
                JOIN membres m ON p.admin_id = m.id
                WHERE p.deleted_at IS NULL 
                ORDER BY p.created_at DESC`;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erreur chargement publications:', err);
            return res.status(500).json({ message: '❌ Erreur serveur', error: err });
        }
        res.json({ publications: results });
    });
};

// Obtenir une publication avec ses commentaires
const getPublicationById = (req, res) => {
    const { id } = req.params;
    
    // Correction: utiliser la table 'membres'
    const sql = `SELECT p.*, m.nom_complet as auteur 
                FROM publications p 
                JOIN membres m ON p.admin_id = m.id
                WHERE p.id = ? AND p.deleted_at IS NULL`;

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Erreur récupération publication:', err);
            return res.status(500).json({ message: '❌ Erreur serveur', error: err });
        }
        if (results.length === 0) return res.status(404).json({ message: '❌ Publication non trouvée' });

        const publication = results[0];

        // Récupérer les commentaires
        const sqlComments = `SELECT c.*, m.nom_complet, m.photo_identite 
                            FROM commentaires c 
                            JOIN membres m ON c.membre_id = m.id
                            WHERE c.publication_id = ? AND c.deleted_at IS NULL
                            ORDER BY c.created_at ASC`;

        db.query(sqlComments, [id], (err, commentaires) => {
            if (err) {
                console.error('Erreur récupération commentaires:', err);
                return res.status(500).json({ message: '❌ Erreur commentaires', error: err });
            }
            res.json({ publication, commentaires });
        });
    });
};

// Modifier une publication
const modifierPublication = (req, res) => {
    const { id } = req.params;
    const { message } = req.body;
    const photo = req.file ? req.file.filename : null;

    let sql, params;
    if (photo) {
        sql = `UPDATE publications SET message = ?, photo = ? WHERE id = ?`;
        params = [message, photo, id];
    } else {
        sql = `UPDATE publications SET message = ? WHERE id = ?`;
        params = [message, id];
    }

    db.query(sql, params, (err) => {
        if (err) {
            console.error('Erreur modification:', err);
            return res.status(500).json({ message: '❌ Erreur modification', error: err });
        }
        res.json({ message: '✅ Publication modifiée avec succès !' });
    });
};

// Supprimer une publication (corbeille)
const supprimerPublication = (req, res) => {
    const { id } = req.params;

    db.query('SELECT * FROM publications WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Erreur vérification publication:', err);
            return res.status(500).json({ message: '❌ Erreur serveur' });
        }
        if (results.length === 0) return res.status(404).json({ message: '❌ Publication non trouvée' });

        const publication = results[0];
        const expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        db.query(
            'INSERT INTO corbeille (table_origine, element_id, donnees, expires_at) VALUES (?, ?, ?, ?)',
            ['publications', id, JSON.stringify(publication), expires_at],
            (err) => {
                if (err) {
                    console.error('Erreur insertion corbeille:', err);
                    return res.status(500).json({ message: '❌ Erreur corbeille' });
                }

                db.query('UPDATE publications SET deleted_at = NOW() WHERE id = ?', [id], (err) => {
                    if (err) {
                        console.error('Erreur suppression:', err);
                        return res.status(500).json({ message: '❌ Erreur suppression' });
                    }
                    res.json({ message: '✅ Publication supprimée — disponible dans la corbeille 30 jours' });
                });
            }
        );
    });
};

// Ajouter un commentaire
const ajouterCommentaire = (req, res) => {
    const { id } = req.params;
    const { contenu } = req.body;
    const membre_id = req.user.id;

    if (!contenu || contenu.trim() === '') {
        return res.status(400).json({ message: '❌ Le commentaire ne peut pas être vide' });
    }

    const sql = `INSERT INTO commentaires (publication_id, membre_id, contenu) VALUES (?, ?, ?)`;
    db.query(sql, [id, membre_id, contenu], (err, result) => {
        if (err) {
            console.error('Erreur ajout commentaire:', err);
            return res.status(500).json({ message: '❌ Erreur commentaire', error: err });
        }
        res.status(201).json({ message: '✅ Commentaire ajouté avec succès !' });
    });
};

module.exports = {
    creerPublication,
    getToutesPublications,
    getPublicationById,
    modifierPublication,
    supprimerPublication,
    ajouterCommentaire
};