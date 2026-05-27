import db from "../config/db.js";
import logger from "../utils/logger.js";

const User = {
    findById: async (id) => {
        try {
            const result = await db.query(
                "SELECT * FROM utilisateur WHERE id_utilisateur = $1",
                [id]
            );
            return result.rows[0];
        } catch (err) {
            logger.logDatabase(err, `SELECT * FROM utilisateur WHERE id_utilisateur = ${id}`);
            throw err; 
        }
    },

    register: async ({nom, prenom, password, email, telephone, adresse, code_postal, ville, raison_sociale, role}) => {
        try {
            const result = await db.query(
                `INSERT INTO utilisateur (nom, prenom, mdp, mail, telephone, adresse, code_postal, ville, raison_sociale, role)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                 RETURNING id_utilisateur AS id, mail AS email, role AS role`,
                [nom, prenom, password, email, telephone, adresse, code_postal, ville, raison_sociale, role]
            );
            return result.rows[0];
        } catch (err) {
            logger.logDatabase(err, `INSERT INTO utilisateur`);
            throw err;
        }
    },

    delete: async (id) => {
        try {
            await db.query("DELETE FROM utilisateur WHERE id_utilisateur = $1", [id]);
        } catch (err) {
            logger.logDatabase(err, `DELETE FROM utilisateur WHERE id_utilisateur = ${id}`);
            throw err;
        }
    },

    update: async ({id, nom, prenom, email, password, telephone, adresse, code_postal, ville, raison_sociale}) => {
        try {
            const result = await db.query(
                `UPDATE utilisateur
                 SET nom = $1,
                     prenom = $2,
                     mdp = $3,
                     mail = $4,
                     telephone = $5,
                     adresse = $6,
                     code_postal = $7,
                     ville = $8,
                     raison_sociale = $9
                 WHERE id_utilisateur = $10 RETURNING id_utilisateur, mail`,
                [nom, prenom, password, email, telephone, adresse, code_postal, ville, raison_sociale, id]
            );
            return result.rows[0];
        } catch (err) {
            logger.logDatabase(err, `UPDATE utilisateur WHERE id_utilisateur = ${id}`);
            throw err;
        }
    },

    findByEmail: async (email) => {
        try {
            const result = await db.query(
                "SELECT * FROM utilisateur WHERE mail = $1",
                [email]
            );
            return result.rows[0];
        } catch (err) {
            logger.logDatabase(err, `SELECT * FROM utilisateur WHERE mail = ?`);
            throw err;
        }
    },
};


export default User;
