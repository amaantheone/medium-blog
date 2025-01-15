import { Hono } from 'hono'

const app = new Hono()

app.post('/api/v1/user/signup', (c) => {
  return c.text('signup route')
})

app.post('/api/v1/user/signin', (c) => {
  return c.text('signin route')
})

app.post('/api/v1/blog', (c) => {
  return c.text('blog route')
})

app.get('/api/v1/blog/:id', (c) => {
  return c.text('blogId route')
})

app.get('/api/v1/blog/bulk', (c) => {
  return c.text('blog bulk route')
})

export default app
