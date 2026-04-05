import "dotenv/config";
import http from "http";
import app from "./app.js";
import { initSocket } from "./utils/socket.js";

const PORT = process.env.PORT || 3000;

const httpServer = http.createServer(app);
initSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
