import Message from "../models/Message.js";
import logger from "../utils/logger.js";

export const getConversations = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      logger.logClientError("Utilisateur non authentifié", req, 401);
      return res.status(401).json({ message: "Authentification requise" });
    }
    
    const conversations = await Message.getConversationList(userId);
    logger.logSuccess(`Conversations récupérées: ${conversations?.length || 0} résultats`, req, 200);
    res.json(conversations);
  } catch (err) {
    logger.logError(err, req, {operation: "getConversations"});
    res.status(500).json({ message: "Erreur serveur" });
  }
};
