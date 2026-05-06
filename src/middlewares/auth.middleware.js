import jwt from "jsonwebtoken";
import RevokedToken from "../models/RevokedTokens.js";

export const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "Token manquant" });
    }

    const [type, token] = authHeader.split(" ");

    if (type !== "Bearer" || !token) {
        return res.status(401).json({ message: "Format du token invalide" });
    }

    try {
        const revoked = await RevokedToken.findOne({ token });
        if (revoked) {
            return res.status(401).json({ message: "Token révoqué" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded; 
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token invalide ou expiré" });
    }
};

export const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Accès refusé" });
    }
    next();
};

