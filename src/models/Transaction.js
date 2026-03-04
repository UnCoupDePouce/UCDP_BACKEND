import db from "../config/db.js";

const Transaction = {
  findById: async (id) => {
    const result = await db.query(
      "SELECT * FROM transaction WHERE id_transaction = $1",
      [id]
    );
    return result.rows[0];
  },

  findByUtilisateur: async (id_utilisateur) => {
    const result = await db.query(
      "SELECT * FROM transaction WHERE id_utilisateur = $1 ORDER BY date_transaction DESC",
      [id_utilisateur]
    );
    return result.rows;
  },

  findByPresta: async (id_presta) => {
    const result = await db.query(
      `SELECT t.* FROM transaction t
       JOIN offre o ON t.id_offre = o.id_offre
       WHERE o.id_presta = $1
       ORDER BY t.date_transaction DESC`,
      [id_presta]
    );
    return result.rows;
  },

  create: async ({ montant, id_offre, id_utilisateur }) => {
    const result = await db.query(
      `INSERT INTO transaction (montant, id_offre, id_utilisateur)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [montant, id_offre, id_utilisateur]
    );
    return result.rows[0];
  },

  updateStatut: async ({ id_transaction, statut }) => {
    const result = await db.query(
      `UPDATE transaction SET statut = $1
       WHERE id_transaction = $2
       RETURNING *`,
      [statut, id_transaction]
    );
    return result.rows[0];
  },

  delete: async (id) => {
    await db.query("DELETE FROM transaction WHERE id_transaction = $1", [id]);
  },
};

export default Transaction;
