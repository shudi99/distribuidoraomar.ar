import { Hono } from "hono";

const app = new Hono();

app.get("/", async c => {
  const { results } = await c.env.DB.prepare(
    "SELECT id, nombre FROM categorias ORDER BY id"
  ).all();

  return c.json(results);
});

export default app;
