import db from "../config/db.js";

const User = {
    findById: async (id) => {
        try {
            const result = await db.query(
                "SELECT * FROM utilisateur WHERE id_utilisateur = $1",
                [id]
            );
            return result.rows[0];
        } catch (err) {
            console.error("Erreur d'exécution de la requête SQL dans Node:", err);
            throw err;
        }
    },

    register: async ({nom, prenom, password, email, telephone, adresse, code_postal, ville, raison_sociale, role}) => {
        const result = await db.query(
            `INSERT INTO utilisateur (nom, prenom, mdp, mail, telephone, adresse, code_postal, ville, raison_sociale, role)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
             RETURNING id_utilisateur AS id, mail AS email, role AS role`,
            [nom, prenom, password, email, telephone, adresse, code_postal, ville, raison_sociale, role]
        );
        return result.rows[0];
    },

    delete: async (id) => {
        await db.query("DELETE FROM utilisateur WHERE id = $1", [id]);
    },

    update: async ({nom, prenom, email, password, telephone, adresse, code_postal, ville, raison_sociale}) => {
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
            [nom, prenom, password, email, telephone, adresse, code_postal, ville, raison_sociale]
        );
        return result.rows[0];
    },

    updateAdmin: async (id, { nom, prenom, mail, role, telephone, adresse, code_postal, ville, raison_sociale, credits, id_entreprise }) => {
        const result = await db.query(
            `UPDATE utilisateur
             SET nom = $1, prenom = $2, mail = $3, role = $4::public."role",
                 telephone = $5, adresse = $6, code_postal = $7, ville = $8,
                 raison_sociale = $9, credits = $10, id_entreprise = $11
             WHERE id_utilisateur = $12
             RETURNING id_utilisateur, nom, prenom, mail, telephone, adresse, code_postal,
                       ville, raison_sociale, credits, role, date_creation, id_entreprise`,
            [
                nom, prenom, mail, role,
                telephone || null, adresse || null, code_postal || null, ville || null,
                raison_sociale || null, credits ?? null, id_entreprise || null,
                id
            ]
        );
        return result.rows[0];
    },

    findAll: async (page = 1, limit = 10) => {
        const offset = (page - 1) * limit;
        const [dataResult, countResult] = await Promise.all([
            db.query(
                `SELECT id_utilisateur, nom, prenom, mail, telephone, adresse, code_postal,
                        ville, raison_sociale, credits, role, date_creation, id_entreprise
                 FROM utilisateur
                 ORDER BY role, nom
                 LIMIT $1 OFFSET $2`,
                [limit, offset]
            ),
            db.query(`SELECT COUNT(*)::int AS total FROM utilisateur`),
        ]);
        return { data: dataResult.rows, total: countResult.rows[0].total };
    },

    findByEmail: async (email) => {
        try {
            const result = await db.query(
                "SELECT * FROM utilisateur WHERE mail = $1",
                [email]
            );
            return result.rows[0];
        } catch (err) {
            console.error("Erreur findByEmail:", err);
            throw err;
        }
    },
};


export default User;
