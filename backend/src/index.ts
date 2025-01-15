import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from 'hono/jwt';

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  }
}>();

app.use('/api/v1/blog/*', async (c, next) => {
  const header = c.req.header("Authorization") || "";
  const token = header.split(" ")[1]

  const response = await verify(token, c.env.JWT_SECRET);
  if (response.id) {
    next()
  } else {
    c.status(403)
    return c.json({
      error: "unauthorized"
    })
  }
})

app.post("/api/v1/user/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const user = await prisma.user.create({
    data: {
      email: body.email,
      password: body.password
    }
  })

  const token = await sign({ id: user.id}, c.env.JWT_SECRET);

  return c.json({
    jwt: token
  });
});

app.post("/api/v1/user/signin", async(c) => {
  const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	const body = await c.req.json();
	const user = await prisma.user.findUnique({
		where: {
			email: body.email
		}
	});

	if (!user) {
		c.status(403);
		return c.json({ error: "user not found" });
	}

	const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
	return c.json({ jwt });
});

app.post("/api/v1/blog", (c) => {
  return c.text("blog route");
});

app.get("/api/v1/blog/:id", (c) => {
  return c.text("blogId route");
});

app.get("/api/v1/blog/bulk", (c) => {
  return c.text("blog bulk route");
});

export default app;
