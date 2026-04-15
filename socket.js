import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Message from "./models/Message.js";

export function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Token manquant"));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch {
      next(new Error("Token invalide"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user.id;

    // Room personnelle pour recevoir les accusés de lecture
    socket.join(`user_${userId}`);

    socket.on("join_conversation", async ({ contactId }) => {
      const room = [userId, contactId].sort().join("_");
      socket.join(room);

      try {
        // Marquer les messages du contact comme lus
        await Message.markAsRead(contactId, userId);

        // Notifier le contact que ses messages ont été lus
        io.to(`user_${contactId}`).emit("messages_read", { by: userId });

        const history = await Message.getConversation(userId, contactId);
        socket.emit("conversation_history", history);
      } catch (err) {
        console.error("Erreur chargement historique:", err);
        socket.emit("error", { message: "Erreur lors du chargement des messages" });
      }
    });

    socket.on("send_message", async ({ contactId, corps }) => {
      if (!corps?.trim()) return;

      try {
        const saved = await Message.save(corps, userId, contactId);
        const room = [userId, contactId].sort().join("_");
        io.to(room).emit("new_message", saved);
      } catch (err) {
        console.error("Erreur envoi message:", err);
        socket.emit("error", { message: "Erreur lors de l'envoi du message" });
      }
    });
  });

  return io;
}
