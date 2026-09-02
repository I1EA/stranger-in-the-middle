# Stranger In The Middle

## The Problem

You and your friends agree on a movie. Everyone opens the booking page at the same time, each trying to grab seats next to each other. But by the time everyone checks out, a stranger is sitting between you. Now you can't share snacks, whisper during the movie, or enjoy it together.

The system treats each person as an individual booking, not as a group. The "stranger in the middle" is the person who ends up in the seat that was supposed to be for your friend.

## The Solution

The AI becomes the stranger in the middle. It coordinates the group booking so that when you check out, it's one purchase - not multiple individual bookings fighting for adjacent seats. The AI handles the coordination, finds seats that work for everyone, and ensures you book as a group.

No strangers between you and your friends. Just the AI making sure you sit together.

## How It Works

1. Start a group session
2. The AI finds seat blocks for your group
3. Preview a block, or start a group vote on the preferred option
4. The AI coordinates the booking as one purchase
5. You all sit together and can cancel before the screening

## WebMCP Tools

- `search_movies` - List available movies
- `get_available_seats` - Show free seats
- `book_tickets` - Book specific seats
- `cancel_booking` - Cancel a booking and release its seats
- `stranger_vote` - Coordinate group voting

## Tech Stack

- Node.js + Express
- EJS templates
- WebMCP Polyfill
- CSS and Tailwind CSS

The demo uses an in-memory data store. Sessions and bookings reset when the server restarts, and multi-user vote updates are represented through the API rather than a persistent real-time transport.

## Run Locally

```bash
npm install
npm start
```

Open http://localhost:3000

License
MIT
