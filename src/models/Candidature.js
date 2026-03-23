import db from "../config/db.js";

export const candidatureModel = {
    create: async (id_prestataire, id_offre, id_client) => {
        const query = `
      INSERT INTO candidature (id_prestataire, id_offre, id_client)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
        const values = [id_prestataire, id_offre, id_client];
        const result = await db.query(query, values);
        return result.rows[0];
    },

    checkExisting: async (id_prestataire, id_offre) => {
        const query = `SELECT * FROM candidature WHERE id_prestataire = $1 AND id_offre = $2`;
        const result = await db.query(query, [id_prestataire, id_offre]);
        return result.rows[0];
    },

    getByPrestataire: async (id_prestataire) => {
        const query = `
            SELECT
                c.id_candidature,
                c.statut,
                c.date_postulation,
                o.id_offre,
                o.titre,
                o.prix,
                o.localisation,
                u.id_utilisateur AS client_id,
                u.prenom AS client_prenom,
                u.nom AS client_nom
            FROM candidature c
                     JOIN offre o ON c.id_offre = o.id_offre
                     JOIN utilisateur u ON o.id_utilisateur = u.id_utilisateur
            WHERE c.id_prestataire = $1
            ORDER BY c.date_postulation DESC;
        `;
        const result = await db.query(query, [id_prestataire]);
        return result.rows;
    }
};