import { Hono } from "hono";
import { cors } from "hono/cors";
import productos from "./routes/productos.js";
import categorias from "./routes/categorias.js";
import upload from "./routes/upload.js";

const app = new Hono();

app.use("*", cors({
  origin: "*",
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"]
}));

app.get("/", c => c.json({ ok: true, service: "distribuidoraomar-api" }));

app.route("/api/productos", productos);
app.route("/api/categorias", categorias);
app.route("/api/upload", upload);

export default app;
