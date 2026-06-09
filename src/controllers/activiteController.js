const db = require('../config/db');

// Obtenir tous les volets avec sous-volets et leurs activités
const getTousVolets = (req, res) => {
    // 1. Récupérer tous les volets
    db.query('SELECT * FROM volets WHERE deleted_at IS NULL ORDER BY id ASC', (err, volets) => {
        if (err) {
            console.error('❌ Erreur volets:', err);
            return res.status(500).json({ message: 'Erreur serveur' });
        }

        // 2. Récupérer tous les sous-volets
        db.query('SELECT * FROM sous_volets WHERE deleted_at IS NULL ORDER BY id ASC', (err, sousVolets) => {
            if (err) {
                console.error('❌ Erreur sous-volets:', err);
                return res.status(500).json({ message: 'Erreur serveur' });
            }

            // 3. Récupérer TOUTES les activités
            db.query('SELECT * FROM activites WHERE deleted_at IS NULL ORDER BY created_at DESC', (err, activites) => {
                if (err) {
                    console.error('❌ Erreur activités:', err);
                    return res.status(500).json({ message: 'Erreur serveur' });
                }

                console.log(`📊 Données trouvées: ${volets.length} volets, ${sousVolets.length} sous-volets, ${activites.length} activités`);

                // 4. Associer les activités aux sous-volets (avec conversion d'ID)
                const sousVoletsAvecActivites = sousVolets.map(sv => {
                    const activitesDuSousVolet = activites.filter(a => Number(a.sous_volet_id) === Number(sv.id));
                    console.log(`  📁 Sous-volet ${sv.id} (${sv.nom}): ${activitesDuSousVolet.length} activité(s)`);
                    return {
                        ...sv,
                        activites: activitesDuSousVolet
                    };
                });

                // 5. Associer les sous-volets aux volets
                const resultat = volets.map(volet => {
                    const sousVoletsDuVolet = sousVoletsAvecActivites.filter(sv => Number(sv.volet_id) === Number(volet.id));
                    return {
                        ...volet,
                        sous_volets: sousVoletsDuVolet
                    };
                });

                res.json({ volets: resultat });
            });
        });
    });
};

// Obtenir toutes les activités
const getToutesActivites = (req, res) => {
    db.query('SELECT * FROM activites WHERE deleted_at IS NULL ORDER BY created_at DESC', (err, results) => {
        if (err) return res.status(500).json({ message: 'Erreur serveur' });
        res.json({ activites: results });
    });
};

// Obtenir une activité par ID
const getActiviteById = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM activites WHERE id = ? AND deleted_at IS NULL', [id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Erreur serveur' });
        if (results.length === 0) return res.status(404).json({ message: 'Activité non trouvée' });
        res.json({ activite: results[0] });
    });
};

// Obtenir activités par sous-volet
const getActivitesBySousVolet = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM activites WHERE sous_volet_id = ? AND deleted_at IS NULL ORDER BY created_at DESC', [id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Erreur serveur' });
        res.json({ activites: results });
    });
};

// ==================== CRUD VOLETS ====================
const creerVolet = (req, res) => {
    const { nom, description, responsable } = req.body;
    db.query('INSERT INTO volets (nom, description, responsable) VALUES (?, ?, ?)', [nom, description, responsable], (err, result) => {
        if (err) return res.status(500).json({ message: 'Erreur création' });
        res.status(201).json({ message: 'Volet créé avec succès', id: result.insertId });
    });
};

const modifierVolet = (req, res) => {
    const { id } = req.params;
    const { nom, description, responsable } = req.body;
    db.query('UPDATE volets SET nom = ?, description = ?, responsable = ? WHERE id = ? AND deleted_at IS NULL', [nom, description, responsable, id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Erreur modification' });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Volet non trouvé' });
        res.json({ message: 'Volet modifié avec succès' });
    });
};

const supprimerVolet = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM volets WHERE id = ? AND deleted_at IS NULL', [id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Erreur serveur' });
        if (results.length === 0) return res.status(404).json({ message: 'Volet non trouvé' });
        
        const volet = results[0];
        const expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        
        db.query('INSERT INTO corbeille (table_origine, element_id, donnees, expires_at) VALUES (?, ?, ?, ?)', ['volets', id, JSON.stringify(volet), expires_at], (err) => {
            if (err) return res.status(500).json({ message: 'Erreur corbeille' });
            db.query('UPDATE volets SET deleted_at = NOW() WHERE id = ?', [id], (err) => {
                if (err) return res.status(500).json({ message: 'Erreur suppression' });
                res.json({ message: 'Volet supprimé' });
            });
        });
    });
};

// ==================== CRUD SOUS-VOLETS ====================
const creerSousVolet = (req, res) => {
    const { volet_id, nom, description } = req.body;
    db.query('INSERT INTO sous_volets (volet_id, nom, description) VALUES (?, ?, ?)', [volet_id, nom, description], (err, result) => {
        if (err) return res.status(500).json({ message: 'Erreur création' });
        res.status(201).json({ message: 'Sous-volet créé avec succès', id: result.insertId });
    });
};

const modifierSousVolet = (req, res) => {
    const { id } = req.params;
    const { volet_id, nom, description } = req.body;
    db.query('UPDATE sous_volets SET volet_id = ?, nom = ?, description = ? WHERE id = ? AND deleted_at IS NULL', [volet_id, nom, description, id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Erreur modification' });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Sous-volet non trouvé' });
        res.json({ message: 'Sous-volet modifié avec succès' });
    });
};

const supprimerSousVolet = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM sous_volets WHERE id = ? AND deleted_at IS NULL', [id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Erreur serveur' });
        if (results.length === 0) return res.status(404).json({ message: 'Sous-volet non trouvé' });
        
        const sousVolet = results[0];
        const expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        
        db.query('INSERT INTO corbeille (table_origine, element_id, donnees, expires_at) VALUES (?, ?, ?, ?)', ['sous_volets', id, JSON.stringify(sousVolet), expires_at], (err) => {
            if (err) return res.status(500).json({ message: 'Erreur corbeille' });
            db.query('UPDATE sous_volets SET deleted_at = NOW() WHERE id = ?', [id], (err) => {
                if (err) return res.status(500).json({ message: 'Erreur suppression' });
                res.json({ message: 'Sous-volet supprimé' });
            });
        });
    });
};

// ==================== CRUD ACTIVITÉS ====================
const creerActivite = (req, res) => {
    const { sous_volet_id, titre, description, participants, partenaires, date_activite, statut } = req.body;
    
    console.log(`📝 Création activité: sous_volet_id=${sous_volet_id}, titre="${titre}"`);
    
    db.query(
        'INSERT INTO activites (sous_volet_id, titre, description, participants, partenaires, date_activite, statut) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [sous_volet_id, titre, description, participants, partenaires, date_activite, statut || 'planifiée'],
        (err, result) => {
            if (err) {
                console.error('❌ Erreur SQL:', err);
                return res.status(500).json({ message: 'Erreur création' });
            }
            console.log(`✅ Activité créée ID: ${result.insertId}`);
            res.status(201).json({ message: 'Activité créée avec succès', id: result.insertId });
        }
    );
};

const modifierActivite = (req, res) => {
    const { id } = req.params;
    const { sous_volet_id, titre, description, participants, partenaires, date_activite, statut } = req.body;
    
    db.query(
        'UPDATE activites SET sous_volet_id = ?, titre = ?, description = ?, participants = ?, partenaires = ?, date_activite = ?, statut = ? WHERE id = ? AND deleted_at IS NULL',
        [sous_volet_id, titre, description, participants, partenaires, date_activite, statut, id],
        (err, result) => {
            if (err) return res.status(500).json({ message: 'Erreur modification' });
            if (result.affectedRows === 0) return res.status(404).json({ message: 'Activité non trouvée' });
            res.json({ message: 'Activité modifiée avec succès' });
        }
    );
};

const supprimerActivite = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM activites WHERE id = ? AND deleted_at IS NULL', [id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Erreur serveur' });
        if (results.length === 0) return res.status(404).json({ message: 'Activité non trouvée' });
        
        const activite = results[0];
        const expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        
        db.query('INSERT INTO corbeille (table_origine, element_id, donnees, expires_at) VALUES (?, ?, ?, ?)', ['activites', id, JSON.stringify(activite), expires_at], (err) => {
            if (err) return res.status(500).json({ message: 'Erreur corbeille' });
            db.query('UPDATE activites SET deleted_at = NOW() WHERE id = ?', [id], (err) => {
                if (err) return res.status(500).json({ message: 'Erreur suppression' });
                res.json({ message: 'Activité supprimée' });
            });
        });
    });
};

const restaurerActivite = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM corbeille WHERE id = ? AND table_origine = "activites"', [id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Erreur serveur' });
        if (results.length === 0) return res.status(404).json({ message: 'Élément non trouvé' });
        
        const donnees = JSON.parse(results[0].donnees);
        db.query('UPDATE activites SET deleted_at = NULL WHERE id = ?', [donnees.id], (err) => {
            if (err) return res.status(500).json({ message: 'Erreur restauration' });
            db.query('DELETE FROM corbeille WHERE id = ?', [id], (err) => {
                if (err) return res.status(500).json({ message: 'Erreur suppression' });
                res.json({ message: 'Activité restaurée avec succès' });
            });
        });
    });
};

module.exports = {
    getTousVolets,
    getToutesActivites,
    getActiviteById,
    getActivitesBySousVolet,
    creerVolet,
    modifierVolet,
    supprimerVolet,
    creerSousVolet,
    modifierSousVolet,
    supprimerSousVolet,
    creerActivite,
    modifierActivite,
    supprimerActivite,
    restaurerActivite
};