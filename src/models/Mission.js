import db from "../config/db.js";

const Offre = {
    findAll: async () => {
        const result = await db.query(
            `SELECT
                 o.*,
                 to_jsonb(u) AS utilisateur, 
                 to_jsonb(m) AS metier
             FROM offre o
                      LEFT JOIN utilisateur u ON o.id_utilisateur = u.id_utilisateur
                      LEFT JOIN metier m ON o.id_metier = m.id_metier
             WHERE o.statut = false
             ORDER BY o.date_offre DESC`
        );
        return result.rows;
    },

    findById: async (id) => {
        const result = await db.query(
            `SELECT 
            o.*,
            to_jsonb(u) AS utilisateur,
            to_jsonb(m) AS metier
             FROM offre o
         LEFT JOIN utilisateur u ON o.id_utilisateur = u.id_utilisateur
         LEFT JOIN metier m ON o.id_metier = m.id_metier
         WHERE o.id_offre = $1`,
            [id]
        );
        return result.rows[0];
    },

    create: async (data) => {
        const { id_utilisateur, id_metier, description, prix, titre, localisation, date_offre } = data;
        const query = `
        INSERT INTO offre (id_utilisateur, id_metier, description, prix, titre, localisation, date_offre)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`;
        const values = [id_utilisateur, id_metier, description, prix, titre, localisation, date_offre];
        const result = await db.query(query, values);
        return result.rows[0];
    },

    update: async (id, { titre, description, prix, id_metier }) => {
        const result = await db.query(
            `UPDATE offre
             SET titre = $1, description = $2, prix = $3, id_metier = $4
             WHERE id_offre = $5 RETURNING *`,
            [titre, description, prix, id_metier, id]
        );
        return result.rows[0];
    },

    delete: async (id) => {
        await db.query("DELETE FROM offre WHERE id_offre = $1", [id]);
    },

    closeOffre: async (id_offre) => {
        await db.query("UPDATE offre SET statut = true WHERE id_offre = $1", [id_offre]);
    }
};

export default Offre;