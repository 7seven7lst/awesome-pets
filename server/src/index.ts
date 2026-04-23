import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import "@/lib/prisma";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { authenticateToken } from "@/middleware/authenticate-token";
import { authRouter } from "@/routes/auth";
import { apiRouter } from "@/routes/api";

const app = express();
const port = Number(process.env.BACKEND_PORT ?? 3001);
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/auth/v1", authRouter);

app.use("/uploads", express.static(join(__dirname, "../public/uploads")));

app.use(authenticateToken);
app.use("/api/v1", apiRouter);


app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
