const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Obtenir tous les membres
const getTousMembres = (req, res) => {
    const sql = `SELECT id, matricule, nom_complet, email, telephone, 
                mention, parcours, niveau, date_naissance, 
                photo_identite, sexe, statut, type_membre, role, created_at 
                FROM membres WHERE deleted_at IS NULL`;
    
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: '❌ Erreur serveur', error: err });
        res.json({ membres: results });
    });
};

// Obtenir un membre par ID
const getMembreById = (req, res) => {
    const { id } = req.params;
    const sql = `SELECT id, matricule, nom_complet, email, telephone, 
                mention, parcours, niveau, date_naissance, 
                photo_identite, sexe, statut, type_membre, role, created_at 
                FROM membres WHERE id = ? AND deleted_at IS NULL`;
    
    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ message: '❌ Erreur serveur', error: err });
        if (results.length === 0) return res.status(404).json({ message: '❌ Membre non trouvé' });
        res.json({ membre: results[0] });
    });
};

// Rechercher membre par matricule, mention, nom ou niveau
const rechercherMembre = (req, res) => {
    const { q } = req.query;
    const sql = `SELECT id, matricule, nom_complet, email, telephone, 
                mention, parcours, niveau, date_naissance, 
                photo_identite, sexe, statut, type_membre, role, created_at 
                FROM membres 
                WHERE deleted_at IS NULL AND (
                    matricule LIKE ? OR 
                    nom_complet LIKE ? OR 
                    mention LIKE ? OR 
                    niveau LIKE ?
                )`;
    
    const search = `%${q}%`;
    db.query(sql, [search, search, search, search], (err, results) => {
        if (err) return res.status(500).json({ message: '❌ Erreur serveur', error: err });
        res.json({ membres: results });
    });
};

// Créer un membre par admin
const creerMembre = async (req, res) => {
    try {
        const {
            nom_complet, email, telephone, mention,
            parcours, niveau, date_naissance, sexe, mot_de_passe, role
        } = req.body;

        // Vérifier email
        db.query('SELECT * FROM membres WHERE email = ?', [email], async (err, results) => {
            if (err) return res.status(500).json({ message: '❌ Erreur serveur' });
            if (results.length > 0) return res.status(400).json({ message: '❌ Email déjà utilisé' });

            const matricule = 'IDEM' + Date.now();
            const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
            const photo_identite = req.file ? req.file.filename : null;
            const userRole = role || 'membre';

            const sql = `INSERT INTO membres 
                (matricule, nom_complet, email, telephone, mention, parcours, 
                niveau, date_naissance, photo_identite, sexe, mot_de_passe, statut, role) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'actif', ?)`;

            db.query(sql, [
                matricule, nom_complet, email, telephone, mention,
                parcours, niveau, date_naissance, photo_identite, sexe, hashedPassword, userRole
            ], (err, result) => {
                if (err) return res.status(500).json({ message: '❌ Erreur création', error: err });
                res.status(201).json({ 
                    message: '✅ Membre créé avec succès !',
                    matricule 
                });
            });
        });
    } catch (error) {
        res.status(500).json({ message: '❌ Erreur serveur', error });
    }
};

// Valider un membre
const validerMembre = (req, res) => {
    const { id } = req.params;
    const sql = `UPDATE membres SET statut = 'actif' WHERE id = ?`;
    
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ message: '❌ Erreur serveur', error: err });
        res.json({ message: '✅ Membre validé avec succès !' });
    });
};

// Supprimer un membre (corbeille)
const supprimerMembre = (req, res) => {
    const { id } = req.params;
    
    // Vérifier si c'est un admin
    db.query('SELECT role FROM membres WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ message: '❌ Erreur serveur' });
        if (results.length === 0) return res.status(404).json({ message: '❌ Membre non trouvé' });
        
        if (results[0].role === 'admin') {
            return res.status(403).json({ message: '❌ Impossible de supprimer un administrateur' });
        }
        
        // Récupérer les données du membre
        db.query('SELECT * FROM membres WHERE id = ?', [id], (err, results) => {
            if (err) return res.status(500).json({ message: '❌ Erreur serveur' });
            if (results.length === 0) return res.status(404).json({ message: '❌ Membre non trouvé' });

            const membre = results[0];
            const expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 jours

            // Ajouter dans corbeille
            db.query(
                'INSERT INTO corbeille (table_origine, element_id, donnees, expires_at) VALUES (?, ?, ?, ?)',
                ['membres', id, JSON.stringify(membre), expires_at],
                (err) => {
                    if (err) return res.status(500).json({ message: '❌ Erreur corbeille' });

                    // Soft delete
                    db.query(
                        'UPDATE membres SET deleted_at = NOW() WHERE id = ?',
                        [id],
                        (err) => {
                            if (err) return res.status(500).json({ message: '❌ Erreur suppression' });
                            res.json({ message: '✅ Membre supprimé — disponible dans la corbeille 30 jours' });
                        }
                    );
                }
            );
        });
    });
};

// Changer mot de passe membre
const changerMotDePasse = async (req, res) => {
    try {
        const { id } = req.params;
        const { ancien_mot_de_passe, nouveau_mot_de_passe } = req.body;

        db.query('SELECT * FROM membres WHERE id = ?', [id], async (err, results) => {
            if (err) return res.status(500).json({ message: '❌ Erreur serveur' });
            if (results.length === 0) return res.status(404).json({ message: '❌ Membre non trouvé' });

            const membre = results[0];
            const isMatch = await bcrypt.compare(ancien_mot_de_passe, membre.mot_de_passe);
            if (!isMatch) return res.status(401).json({ message: '❌ Ancien mot de passe incorrect' });

            const hashedPassword = await bcrypt.hash(nouveau_mot_de_passe, 10);
            db.query('UPDATE membres SET mot_de_passe = ? WHERE id = ?', [hashedPassword, id], (err) => {
                if (err) return res.status(500).json({ message: '❌ Erreur mise à jour' });
                res.json({ message: '✅ Mot de passe changé avec succès !' });
            });
        });
    } catch (error) {
        res.status(500).json({ message: '❌ Erreur serveur', error });
    }
};

// Suspendre un membre
const suspendreMembre = (req, res) => {
    const { id } = req.params;
    const sql = `UPDATE membres SET statut = 'suspendu' WHERE id = ? AND role != 'admin'`;
    
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ message: '❌ Erreur serveur', error: err });
        if (result.affectedRows === 0) {
            return res.status(400).json({ message: '❌ Impossible de suspendre un administrateur' });
        }
        res.json({ message: '✅ Membre suspendu avec succès !' });
    });
};

// Activer un membre
const activerMembre = (req, res) => {
    const { id } = req.params;
    const sql = `UPDATE membres SET statut = 'actif' WHERE id = ?`;
    
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ message: '❌ Erreur serveur', error: err });
        res.json({ message: '✅ Membre réactivé avec succès !' });
    });
};

// Changer photo de profil
const changerPhoto = (req, res) => {
    const { id } = req.params;
    const photo_identite = req.file ? req.file.filename : null;

    if (!photo_identite) return res.status(400).json({ message: '❌ Aucune photo fournie' });

    db.query('UPDATE membres SET photo_identite = ? WHERE id = ?', [photo_identite, id], (err) => {
        if (err) return res.status(500).json({ message: '❌ Erreur mise à jour' });
        res.json({ message: '✅ Photo mise à jour avec succès !' });
    });
};

module.exports = { 
    getTousMembres, 
    getMembreById, 
    rechercherMembre,
    creerMembre, 
    validerMembre,
    supprimerMembre,
    changerMotDePasse,
    changerPhoto,
    suspendreMembre,
    activerMembre
};