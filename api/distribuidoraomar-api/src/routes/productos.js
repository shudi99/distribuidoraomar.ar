import { Hono } from "hono";

const app = new Hono();

app.get("/", async c => {
  const { results } = await c.env.DB.prepare(`
    SELECT
      p.id,
      p.titulo,
      p.descripcion,
      p.precio,
      p.imagen,
      p.visible,
      p.orden,
      p.codigo,
      p.stock,
      p.destacado,
      c.id AS categoria_id,
      c.nombre AS categoria
    FROM productos p
    LEFT JOIN categorias c ON c.id = p.categoria_id
    WHERE p.visible = 1
    ORDER BY p.destacado DESC, p.orden ASC, p.id DESC
  `).all();

  return c.json(results);
});

app.post("/", async c => {
  const body = await c.req.json();

  if (!body.titulo || body.precio === undefined) {
    return c.json({ error: "titulo y precio son obligatorios" }, 400);
  }

  const result = await c.env.DB.prepare(`
    INSERT INTO productos
    (titulo, descripcion, precio, categoria_id, imagen, codigo, stock, destacado, visible)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    body.titulo,
    body.descripcion || "",
    Number(body.precio),
    body.categoria_id || null,
    body.imagen || "",
    body.codigo || "",
    Number(body.stock || 0),
    body.destacado ? 1 : 0,
    body.visible === false ? 0 : 1
  ).run();

  return c.json({ ok: true, id: result.meta.last_row_id });
});

export default app;
