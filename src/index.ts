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
  "/save-score",
  zValidator(
    "json",
    z.object({
      name: z.string(),
      score: z.number(),
      email: z.string().email(),
    })
  ),
  async (c) => {
    const { email, name, score } = c.req.valid("json")

    console.log('[SAVE SCORE] email: "%s", name: "%s", score: %d', email, name, score)

    await c.env.PLAYER_SCORE.put(email, String(score), {
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
  console.log('SCORE keys', scoresList)
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
