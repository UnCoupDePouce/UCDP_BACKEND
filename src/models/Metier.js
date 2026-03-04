import db from "../config/db.js";

const Metier = {
  findAll: async () => {
    const result = await db.query("SELECT * FROM metier ORDER BY nom");
    return result.rows;
  },

  findById: async (id) => {
    const result = await db.query(
      "SELECT * FROM metier WHERE id_metier = $1",
      [id]
    );
    return result.rows[0];
  },

  create: async ({ nom }) => {
    const result = await db.query(
      `INSERT INTO metier (nom)
       VALUES ($1)
       RETURNING id_metier, nom`,
      [nom]
    );
    return result.rows[0];
  },

  update: async ({ id_metier, nom }) => {
    const result = await db.query(
      `UPDATE metier SET nom = $1
       WHERE id_metier = $2
       RETURNING id_metier, nom`,
      [nom, id_metier]
    );
    return result.rows[0];
  },

  delete: async (id) => {
    await db.query("DELETE FROM metier WHERE id_metier = $1", [id]);
  },
};

export default Metier;
