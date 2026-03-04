import db from "../config/db.js";

const Admin = {
  findById: async (id) => {
    const result = await db.query(
      "SELECT * FROM admin WHERE id_admin = $1",
      [id]
    );
    return result.rows[0];
  },

  findByEmail: async (email) => {
    const result = await db.query(
      "SELECT * FROM admin WHERE email = $1",
      [email]
    );
    return result.rows[0];
  },

  create: async ({ nom, prenom, email, password }) => {
    const result = await db.query(
      `INSERT INTO admin (nom, prenom, email, mdp)
       VALUES ($1, $2, $3, $4)
       RETURNING id_admin, email`,
      [nom, prenom, email, password]
    );
    return result.rows[0];
  },

  update: async ({ id_admin, nom, prenom, email, password }) => {
    const result = await db.query(
      `UPDATE admin SET nom = $1, prenom = $2, email = $3, mdp = $4
       WHERE id_admin = $5
       RETURNING id_admin, email`,
      [nom, prenom, email, password, id_admin]
    );
    return result.rows[0];
  },

  delete: async (id) => {
    await db.query("DELETE FROM admin WHERE id_admin = $1", [id]);
  },
};

export default Admin;
