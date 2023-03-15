import { Hono } from "hono"
import { cors } from "hono/cors"
import { zValidator } from "@hono/zod-validator"
import { z } from "zod"

type Env = {
  PLAYER_SCORE: KVNamespace
}

const app = new Hono<{ Bindings: Env }>()
app.use(
  "/*",
  cors({
    origin: "*",
  })
)

type Metadata = {
  name: string
  email: string
  score: number
}

app.post(
  "/save",
  zValidator(
    "json",
    z.object({
      name: z.string(),
      score: z.number(),
      email: z.string().email(),
    })
  ),
  (c) => {
    const { email, name, score } = c.req.valid("json")

    c.env.PLAYER_SCORE.put(email, String(score), {
      metadata: {
        name,
        email,
        score,
      } satisfies Metadata,
    })

    return c.json({ message: "Successfully saved score" })
  }
)

app.get("/leaderboard", async (c) => {
  const scoresList = (await c.env.PLAYER_SCORE.list<Metadata>({ limit: 50 })).keys
  const leaderboard = scoresList
    .filter((score) => score.metadata)
    .sort((a, b) => b.metadata!.score - a.metadata!.score)
    .map((score) => ({
      name: score.metadata!.name,
      email: score.metadata!.email,
      score: score.metadata!.score,
    }))

  return c.json(leaderboard)
})

export default app
