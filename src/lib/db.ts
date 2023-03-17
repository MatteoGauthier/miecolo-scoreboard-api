export type Metadata = {
  name: string
  email: string
  score: number
}

export async function getLeaderBoard(kv: KVNamespace<string>) {
  const scoresList = (await kv.list<Metadata>({ limit: 50 })).keys
  const leaderboard = scoresList
    .filter((score) => score.metadata)
    .sort((a, b) => b.metadata!.score - a.metadata!.score)
    .map((score) => ({
      name: score.metadata!.name,
      email: score.metadata!.email,
      score: score.metadata!.score,
    }))

  return leaderboard
}
