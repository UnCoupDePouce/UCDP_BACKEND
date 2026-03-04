import db from "../config/db.js";

const Offre = {
  findAll: async () => {
    const result = await db.query(
      "SELECT * FROM offre ORDER BY date_creation DESC"
    );
    return result.rows;
  },

  findById: async (id) => {
    const result = await db.query(
      "SELECT * FROM offre WHERE id_offre = $1",
      [id]
    );
    return result.rows[0];
  },

  findByPresta: async (id_presta) => {
    const result = await db.query(
      "SELECT * FROM offre WHERE id_presta = $1 ORDER BY date_creation DESC",
      [id_presta]
    );
    return result.rows;
  },

  create: async ({ titre, description, prix, id_presta }) => {
    const result = await db.query(
      `INSERT INTO offre (titre, description, prix, id_presta)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [titre, description, prix, id_presta]
    );
    return result.rows[0];
  },

  update: async ({ id_offre, titre, description, prix, statut }) => {
    const result = await db.query(
      `UPDATE offre SET titre = $1, description = $2, prix = $3, statut = $4
       WHERE id_offre = $5
       RETURNING *`,
      [titre, description, prix, statut, id_offre]
    );
    return result.rows[0];
  },

  delete: async (id) => {
    await db.query("DELETE FROM offre WHERE id_offre = $1", [id]);
  },
};

export default Offre;
