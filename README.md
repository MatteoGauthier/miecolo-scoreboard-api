# Miecolo Scoreboard API

This is a simple API made with Cloudflare Worker and [Hono](https://hono.dev) to create a scoreboard for a game.

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
