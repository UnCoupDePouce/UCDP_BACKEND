import express from "express";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import metierRoutes from "./routes/metier.routes.js";
import metierPrestaRoutes from "./routes/metierPresta.routes.js";
import offreRoutes from "./routes/offre.routes.js";
import prestataireRoutes from "./routes/prestataire.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";

const app = express();
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/metier", metierRoutes);
app.use("/api/metier-presta", metierPrestaRoutes);
app.use("/api/offre", offreRoutes);
app.use("/api/prestataire", prestataireRoutes);
app.use("/api/transaction", transactionRoutes);

app.get("/api/ping", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
