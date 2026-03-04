import db from "../config/db.js";

const Prestataire = {
  findById: async (id) => {
    const result = await db.query(
      "SELECT * FROM prestataire WHERE id_presta = $1",
      [id]
    );
    return result.rows[0];
  },

  findByEmail: async (email) => {
    const result = await db.query(
      "SELECT * FROM prestataire WHERE email = $1",
      [email]
    );
    return result.rows[0];
  },

  findAll: async () => {
    const result = await db.query(
      "SELECT id_presta, nom, prenom, email, telephone, adresse, code_postal, ville, siret FROM prestataire"
    );
    return result.rows;
  },

  create: async ({ nom, prenom, email, password, telephone, adresse, code_postal, ville, siret }) => {
    const result = await db.query(
      `INSERT INTO prestataire (nom, prenom, email, mdp, telephone, adresse, code_postal, ville, siret)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id_presta, email`,
      [nom, prenom, email, password, telephone, adresse, code_postal, ville, siret]
    );
    return result.rows[0];
  },

  update: async ({ id_presta, nom, prenom, email, password, telephone, adresse, code_postal, ville, siret }) => {
    const result = await db.query(
      `UPDATE prestataire SET nom = $1, prenom = $2, email = $3, mdp = $4, telephone = $5,
       adresse = $6, code_postal = $7, ville = $8, siret = $9
       WHERE id_presta = $10
       RETURNING id_presta, email`,
      [nom, prenom, email, password, telephone, adresse, code_postal, ville, siret, id_presta]
    );
    return result.rows[0];
  },

  delete: async (id) => {
    await db.query("DELETE FROM prestataire WHERE id_presta = $1", [id]);
  },
};

export default Prestataire;
