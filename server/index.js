import express from "express";
import cors from "cors";
import profileRoutes from "./routes/profile.routes.js";
import contentRoutes from "./routes/content.routes.js";
import taskRoutes from "./routes/task.routes.js";
import { initDatabase } from "./db.js";

const app = express();
const PORT = process.env.PORT || 3001;

initDatabase();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_, res) => {
  res.json({ ok: true });
});

app.use("/api", profileRoutes);
app.use("/api", contentRoutes);
app.use("/api", taskRoutes);

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});
