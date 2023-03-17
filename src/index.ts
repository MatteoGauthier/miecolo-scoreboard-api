import { Hono } from "hono"
import { cors } from "hono/cors"
import { zValidator } from "@hono/zod-validator"
import { z } from "zod"
import { getLeaderBoard, Metadata } from "./lib/db"

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

    const existingScore = await c.env.PLAYER_SCORE.get(email, "text")
    const leaderboard = await getLeaderBoard(c.env.PLAYER_SCORE)

    if (existingScore && Number(existingScore) > score) {
      return c.json({
        message: "Your score is lower than your previous score",
        leaderboard,
      })
    }

    await c.env.PLAYER_SCORE.put(email, String(score), {
      metadata: {
        name,
        email,
        score,
      } satisfies Metadata,
    })

    return c.json({ message: "Successfully saved score", leaderboard })
  }
)

app.get("/leaderboard", async (c) => {
  const leaderboard = await getLeaderBoard(c.env.PLAYER_SCORE)
  return c.json(leaderboard)
})

export default app
