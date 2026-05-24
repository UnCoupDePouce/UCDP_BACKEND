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
    },

    getByClient: async (id_client) => {
        const query = `
            SELECT
                c.id_candidature,
                c.id_prestataire,
                c.statut,
                c.date_postulation,
                o.id_offre,
                o.titre,
                o.prix,
                o.localisation,
                u.id_utilisateur AS presta_id,
                u.prenom AS presta_prenom,
                u.nom AS presta_nom
            FROM candidature c
                     JOIN offre o ON c.id_offre = o.id_offre
                     JOIN utilisateur u ON c.id_prestataire = u.id_utilisateur
            WHERE o.id_utilisateur = $1
            ORDER BY o.date_offre DESC, c.date_postulation DESC;
        `;
        const result = await db.query(query, [id_client]);
        return result.rows;
    },

    get: async (filters = {}) => {
        const { id_client, id_prestataire } = filters;

        let query = `
            SELECT c.id_candidature,
                   c.statut,
                   c.date_postulation,

                   json_build_object(
                           'id_offre', o.id_offre,
                           'titre', o.titre,
                           'description', o.description,
                           'prix', o.prix,
                           'localisation', o.localisation,
                           'date', o.date_offre,
                           'statut', o.statut
                   ) AS mission,

                   json_build_object(
                           'id_utilisateur', u_presta.id_utilisateur,
                           'prenom', u_presta.prenom,
                           'nom', u_presta.nom,
                           'mail', u_presta.mail,
                           'metier',u_presta.metier
                   ) AS prestataire,

                   json_build_object(
                           'id_utilisateur', u_client.id_utilisateur,
                           'prenom', u_client.prenom,
                           'nom', u_client.nom,
                           'mail', u_client.mail
                   ) AS client
            FROM candidature c
                     JOIN offre o ON c.id_offre = o.id_offre
                     JOIN utilisateur u_presta ON c.id_prestataire = u_presta.id_utilisateur
                     JOIN utilisateur u_client ON c.id_client = u_client.id_utilisateur
        `;

        const values = [];
        const whereClauses = [];

        if (id_client) {
            values.push(id_client);
            whereClauses.push(`c.id_client = $${values.length}`);
        }

        if (id_prestataire) {
            values.push(id_prestataire);
            whereClauses.push(`c.id_prestataire = $${values.length}`);
        }

        if (whereClauses.length > 0) {
            query += ` WHERE ${whereClauses.join(' AND ')}`;
        }

        query += ` ORDER BY c.date_postulation DESC;`;

        const result = await db.query(query, values);
        return result.rows;
    },

    valider: async (id_candidature) => {
        const query = `
            UPDATE candidature
            SET statut = 'VALIDE'
            WHERE id_candidature = $1 AND statut = 'EN_ATTENTE'
            RETURNING *;
        `;
        const result = await db.query(query, [id_candidature]);
        return result.rows[0];
    },

    refuser: async (id_candidature) => {
        const query = `
            UPDATE candidature
            SET statut = 'REFUSE'
            WHERE id_candidature = $1 AND statut = 'EN_ATTENTE'
            RETURNING *;
        `;
        const result = await db.query(query, [id_candidature]);
        return result.rows[0];
    }
};