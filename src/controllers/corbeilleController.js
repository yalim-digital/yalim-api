const db = require('../config/db');

// Obtenir tout le contenu de la corbeille
const getCorbeille = (req, res) => {
    const sql = `SELECT * FROM corbeille ORDER BY created_at DESC`;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: '❌ Erreur serveur', error: err });
        res.json({ corbeille: results });
    });
};

// Restaurer un élément
const restaurerElement = (req, res) => {
    const { id } = req.params;

    db.query('SELECT * FROM corbeille WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ message: '❌ Erreur serveur' });
        if (results.length === 0) return res.status(404).json({ message: '❌ Élément non trouvé' });

        const element = results[0];
        const table = element.table_origine;

        // Restaurer dans la table d'origine
        db.query(
            `UPDATE ${table} SET deleted_at = NULL WHERE id = ?`,
            [element.element_id],
            (err) => {
                if (err) return res.status(500).json({ message: '❌ Erreur restauration' });

                // Supprimer de la corbeille
                db.query('DELETE FROM corbeille WHERE id = ?', [id], (err) => {
                    if (err) return res.status(500).json({ message: '❌ Erreur suppression corbeille' });
                    res.json({ message: '✅ Élément restauré avec succès !' });
                });
            }
        );
    });
};

// Supprimer définitivement un élément
const supprimerDefinitivement = (req, res) => {
    const { id } = req.params;

    db.query('SELECT * FROM corbeille WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ message: '❌ Erreur serveur' });
        if (results.length === 0) return res.status(404).json({ message: '❌ Élément non trouvé' });

        const element = results[0];

        // Supprimer définitivement de la table d'origine
        db.query(
            `DELETE FROM ${element.table_origine} WHERE id = ?`,
            [element.element_id],
            (err) => {
                if (err) return res.status(500).json({ message: '❌ Erreur suppression définitive' });

                // Supprimer de la corbeille
                db.query('DELETE FROM corbeille WHERE id = ?', [id], (err) => {
                    if (err) return res.status(500).json({ message: '❌ Erreur suppression corbeille' });
                    res.json({ message: '✅ Élément supprimé définitivement !' });
                });
            }
        );
    });
};

// Vider toute la corbeille
const viderCorbeille = (req, res) => {
    // Supprimer définitivement tous les éléments
    db.query('SELECT * FROM corbeille', (err, elements) => {
        if (err) return res.status(500).json({ message: '❌ Erreur serveur' });

        elements.forEach(element => {
            db.query(`DELETE FROM ${element.table_origine} WHERE id = ?`, [element.element_id]);
        });

        db.query('DELETE FROM corbeille', (err) => {
            if (err) return res.status(500).json({ message: '❌ Erreur vidage corbeille' });
            res.json({ message: '✅ Corbeille vidée avec succès !' });
        });
    });
};

// Suppression automatique après 30 jours
const nettoyageAutomatique = () => {
    const sql = `SELECT * FROM corbeille WHERE expires_at < NOW()`;

    db.query(sql, (err, elements) => {
        if (err) return console.error('❌ Erreur nettoyage corbeille:', err);

        elements.forEach(element => {
            db.query(`DELETE FROM ${element.table_origine} WHERE id = ?`, [element.element_id]);
        });

        db.query('DELETE FROM corbeille WHERE expires_at < NOW()', (err) => {
            if (!err) console.log('✅ Nettoyage automatique corbeille effectué !');
        });
    });
};

// Lancer nettoyage automatique toutes les 24 heures
setInterval(nettoyageAutomatique, 24 * 60 * 60 * 1000);

module.exports = {
    getCorbeille,
    restaurerElement,
    supprimerDefinitivement,
    viderCorbeille
};