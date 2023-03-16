# Miecolo Scoreboard API

This is a simple API to create a scoreboard for a game. It's made with Cloudflare Worker, using [Hono](https://hono.dev) as web framework and Cloudflare Worker KV as database.

## Base URL

```
https://miecolo-scoreboard-api.squale.workers.dev/
```

## Usage example

```js
const API_URL = "https://miecolo-scoreboard-api.squale.workers.dev"

async function main() {
  const captureScore = await fetch(`${API_URL}/save-score`, {
    method: "POST",
    body: JSON.stringify({
      name: "ddddd",
      email: "maxime@google.com",
      score: 1000000,
    }),
  })
  console.log(captureScore.status)
  console.log(await captureScore.json())

  const leaderboard = await fetch(`${API_URL}/leaderboard`)

  console.log(await leaderboard.json())
}

main()
```

## API Docs

### GET /leaderboard

Get the leaderboard.

#### Request

```http
GET /leaderboard
```

#### Response

```json
[
  {
    "name": "John",
    "email": "john@squale.agency",
    "score": 11200
  },
  {
    "name": "Matt",
    "email": "matt@squale.agency",
    "score": 500
  },
  {
    "name": "Eric",
    "email": "eric@squale.agency",
    "score": 100
  }
]
```

### POST /save-score

Save a score to the leaderboard.

#### Request

```http
POST /save-score

{
	"name": "Example person",
	"email": "example@squale.agency",
	"score": 100
}
```

### Response

```json
{
  "message": "Successfully saved score"
}
```
