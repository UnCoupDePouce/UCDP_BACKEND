import Message from "../models/Message.js";
import logger from "../utils/logger.js";

export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const conversations = await Message.getConversationList(userId);
    logger.logSuccess("Conversations récupérées", req, 200);
    res.json(conversations);
  } catch (err) {
    console.error("Erreur getConversations:", err);
    logger.logError(err, req);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
