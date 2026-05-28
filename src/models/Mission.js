import db from "../config/db.js";
import logger from "../utils/logger.js";

const Offre = {
    findAll: async (ville = null) => {
        try {
            const values = [];
            const proximitySort = ville
                ? `CASE WHEN LOWER(o.localisation) LIKE LOWER($1) THEN 0 ELSE 1 END,`
                : "";

            if (ville) values.push(`%${ville}%`);

            const result = await db.query(
                `SELECT
                     o.*,
                     to_jsonb(u) AS utilisateur,
                     to_jsonb(m) AS metier,
                     EXISTS(
                         SELECT 1 FROM candidature c
                         WHERE c.id_offre = o.id_offre AND c.statut = 'VALIDE'
                     ) AS is_accepted
                 FROM offre o
                          LEFT JOIN utilisateur u ON o.id_utilisateur = u.id_utilisateur
                          LEFT JOIN metier m ON o.id_metier = m.id_metier
                 WHERE o.statut = false
                 ORDER BY ${proximitySort} o.date_offre DESC`,
                values
            );
            return result.rows;
        } catch (err) {
            logger.logDatabase(err, "SELECT * FROM offre WHERE statut = false");
            throw err;
        }
    },

    findById: async (id) => {
        try {
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
        } catch (err) {
            logger.logDatabase(err, `SELECT * FROM offre WHERE id_offre = ${id}`);
            throw err;
        }
    },

    create: async (data) => {
        try {
            const { id_utilisateur, id_metier, description, prix, titre, localisation, date_offre } = data;
            const query = `
            INSERT INTO offre (id_utilisateur, id_metier, description, prix, titre, localisation, date_offre)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`;
            const values = [id_utilisateur, id_metier, description, prix, titre, localisation, date_offre];
            const result = await db.query(query, values);
            return result.rows[0];
        } catch (err) {
            logger.logDatabase(err, "INSERT INTO offre");
            throw err;
        }
    },

    update: async (id, { titre, description, prix, id_metier }) => {
        try {
            const result = await db.query(
                `UPDATE offre
                 SET titre = $1, description = $2, prix = $3, id_metier = $4
                 WHERE id_offre = $5 RETURNING *`,
                [titre, description, prix, id_metier, id]
            );
            return result.rows[0];
        } catch (err) {
            logger.logDatabase(err, `UPDATE offre WHERE id_offre = ${id}`);
            throw err;
        }
    },

    delete: async (id) => {
        try {
            await db.query("DELETE FROM offre WHERE id_offre = $1", [id]);
        } catch (err) {
            logger.logDatabase(err, `DELETE FROM offre WHERE id_offre = ${id}`);
            throw err;
        }
    },

    closeOffre: async (id_offre) => {
        try {
            await db.query("UPDATE offre SET statut = true WHERE id_offre = $1", [id_offre]);
        } catch (err) {
            logger.logDatabase(err, `UPDATE offre SET statut = true WHERE id_offre = ${id_offre}`);
            throw err;
        }
    },

    search: async (research) => {
    try {
        const result = await db.query(
            `SELECT 
                o.*,
                to_jsonb(u) AS utilisateur,
                to_jsonb(m) AS metier
            FROM offre o
            LEFT JOIN utilisateur u 
                ON o.id_utilisateur = u.id_utilisateur
            LEFT JOIN metier m 
                ON o.id_metier = m.id_metier
            WHERE 
                o.localisation ILIKE $1
                OR o.titre ILIKE $1
                OR m.nom ILIKE $1
                OR u.nom ILIKE $1
                OR u.prenom ILIKE $1
            ORDER BY o.date_offre DESC`,
            [`%${research}%`]
        );

        return result.rows;
    } catch (err) {
        logger.logDatabase(err, `SEARCH offre with research ${research}`);
        throw err;
    }
}
};
        export default Offre;