import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import messageRoutes from "./routes/message.routes.js";
import missionRoutes from "./routes/mission.routes.js";
import metierRoutes from "./routes/metier.routes.js";
import candidatureRoutes from "./routes/candidature.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/offre", missionRoutes);
app.use("/api/metier", metierRoutes);
app.use("/api/candidatures", candidatureRoutes);

app.get("/api/ping", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
