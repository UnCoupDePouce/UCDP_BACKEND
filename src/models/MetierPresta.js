import db from "../config/db.js";

const MetierPresta = {
  findByPresta: async (id_presta) => {
    const result = await db.query(
      `SELECT mp.id_metier, mp.id_presta, m.nom
       FROM metier_presta mp
       JOIN metier m ON mp.id_metier = m.id_metier
       WHERE mp.id_presta = $1`,
      [id_presta]
    );
    return result.rows;
  },

  findByMetier: async (id_metier) => {
    const result = await db.query(
      `SELECT mp.id_metier, mp.id_presta, p.nom, p.prenom
       FROM metier_presta mp
       JOIN prestataire p ON mp.id_presta = p.id_presta
       WHERE mp.id_metier = $1`,
      [id_metier]
    );
    return result.rows;
  },

  create: async ({ id_metier, id_presta }) => {
    const result = await db.query(
      `INSERT INTO metier_presta (id_metier, id_presta)
       VALUES ($1, $2)
       RETURNING id_metier, id_presta`,
      [id_metier, id_presta]
    );
    return result.rows[0];
  },

  delete: async ({ id_metier, id_presta }) => {
    await db.query(
      "DELETE FROM metier_presta WHERE id_metier = $1 AND id_presta = $2",
      [id_metier, id_presta]
    );
  },
};

export default MetierPresta;
