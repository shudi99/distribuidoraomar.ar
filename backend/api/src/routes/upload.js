import { Hono } from "hono";

const app = new Hono();

app.post("/", async c => {
  const form = await c.req.formData();
  const file = form.get("file");

  if (!file || typeof file === "string") {
    return c.json({ error: "archivo inválido" }, 400);
  }

  if (!file.type.startsWith("image/")) {
    return c.json({ error: "solo se permiten imágenes" }, 400);
  }

  if (file.size > 3 * 1024 * 1024) {
    return c.json({ error: "imagen demasiado grande, máximo 3 MB" }, 400);
  }

  const ext = file.type.split("/")[1] || "jpg";
  const key = `productos/${crypto.randomUUID()}.${ext}`;

  await c.env.IMG.put(key, file.stream(), {
    httpMetadata: { contentType: file.type }
  });

  return c.json({
    ok: true,
    key,
    url: `/api/upload/img/${key}`
  });
});

app.get("/img/*", async c => {
  const key = c.req.path.replace("/api/upload/img/", "");
  const object = await c.env.IMG.get(key);

  if (!object) return c.text("Not found", 404);

  return new Response(object.body, {
    headers: {
      "content-type": object.httpMetadata?.contentType || "application/octet-stream",
      "cache-control": "public, max-age=31536000, immutable"
    }
  });
});

export default app;
