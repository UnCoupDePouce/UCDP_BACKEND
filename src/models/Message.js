import db from "../config/db.js";

const Message = {
  save: async (corps, id_expediteur, id_destinataire) => {
    const result = await db.query(
      `INSERT INTO messages (corps, id_expediteur, id_destinataire)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [corps, id_expediteur, id_destinataire]
    );
    return result.rows[0];
  },

  getConversation: async (user1, user2) => {
    const result = await db.query(
      `SELECT *
       FROM messages
       WHERE (id_expediteur = $1 AND id_destinataire = $2)
          OR (id_expediteur = $2 AND id_destinataire = $1)
       ORDER BY ctid ASC`,
      [user1, user2]
    );
    return result.rows;
  },

  markAsRead: async (senderId, recipientId) => {
    await db.query(
      `UPDATE messages SET lu = true
       WHERE id_expediteur = $1 AND id_destinataire = $2 AND lu = false`,
      [senderId, recipientId]
    );
  },

  getConversationList: async (userId) => {
    const result = await db.query(
      `SELECT DISTINCT ON (contact_id)
         contact_id,
         u.nom,
         u.prenom,
         m.corps AS last_message
       FROM (
         SELECT
           CASE WHEN id_expediteur = $1 THEN id_destinataire ELSE id_expediteur END AS contact_id,
           corps,
           ctid
         FROM messages
         WHERE id_expediteur = $1 OR id_destinataire = $1
       ) m
       JOIN utilisateur u ON u.id_utilisateur = m.contact_id
       ORDER BY contact_id, m.ctid DESC`,
      [userId]
    );
    return result.rows;
  },
};

export default Message;
