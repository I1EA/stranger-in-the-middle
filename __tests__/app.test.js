import request from 'supertest';
import app from '../app.js';
import db, { scoreSeatBlock, findBestBlocks, ROWS, COLS, TOTAL_SEATS } from '../db.js';

describe('Stranger In The Middle (SITM) - Test Suite', () => {
  describe('Health Check API', () => {
    it('should return healthy status and metadata', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('healthy');
      expect(res.body.app).toContain('Stranger In The Middle');
      expect(res.body.webmcpSupport).toBe(true);
    });
  });

  describe('Movies API', () => {
    it('GET /api/movies should return the full movies catalog', async () => {
      const res = await request(app).get('/api/movies');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(Array.isArray(res.body.data.movies)).toBe(true);
      expect(res.body.data.movies.length).toBeGreaterThan(0);
    });

    it('GET /api/movies/spiderman should return Spider-Man movie details and seating', async () => {
      const res = await request(app).get('/api/movies/spiderman');
      expect(res.statusCode).toBe(200);
      expect(res.body.data.movie.title).toContain('Spider-Man');
      expect(res.body.data.seats.length).toBe(TOTAL_SEATS);
    });

    it('GET /api/movies/unknown_id should return 404', async () => {
      const res = await request(app).get('/api/movies/unknown_movie_xyz');
      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe('fail');
    });

    it('GET /api/movies/:id/seats should return the seat grid', async () => {
      const res = await request(app).get('/api/movies/spiderman/seats');
      expect(res.statusCode).toBe(200);
      expect(res.body.data.seats.length).toBe(TOTAL_SEATS);
    });
  });

  describe('Sessions & Group Voting API', () => {
    let createdSessionId = null;

    it('POST /api/sessions should create a new group session', async () => {
      const res = await request(app)
        .post('/api/sessions')
        .send({ movieId: 'spiderman', groupSize: 4, organizerName: 'Alex' });

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.session).toBeDefined();
      expect(res.body.data.session.groupSize).toBe(4);
      expect(res.body.data.session.movieId).toBe('spiderman');
      createdSessionId = res.body.data.session.id;
    });

    it('GET /api/sessions/:id should return session state', async () => {
      const res = await request(app).get(`/api/sessions/${createdSessionId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.session.id).toBe(createdSessionId);
    });

    it('POST /api/sessions/:id/find-seats should generate seat suggestions', async () => {
      const res = await request(app)
        .post(`/api/sessions/${createdSessionId}/find-seats`)
        .send({ groupSize: 3 });

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data.suggestions)).toBe(true);
      expect(res.body.data.suggestions.length).toBeGreaterThan(0);
    });

    it('POST /api/sessions/:id/start-voting should activate voting state', async () => {
      const res = await request(app)
        .post(`/api/sessions/${createdSessionId}/start-voting`)
        .send({ durationSeconds: 120 });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.session.status).toBe('voting');
    });

    it('POST /api/sessions/:id/vote should record a vote', async () => {
      const res = await request(app)
        .post(`/api/sessions/${createdSessionId}/vote`)
        .send({ optionIndex: 0, voterName: 'Alex' });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.session.voteCounts[0]).toBe(1);
    });

    it('POST /api/sessions/:id/end-voting should tally votes and designate winner', async () => {
      const res = await request(app).post(`/api/sessions/${createdSessionId}/end-voting`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.winnerOptionIndex).toBe(0);
      expect(res.body.data.winningSeats.length).toBeGreaterThan(0);
    });

    it('POST /api/sessions/:id/book should book winning seats', async () => {
      const res = await request(app)
        .post(`/api/sessions/${createdSessionId}/book`)
        .send({ bookedBy: 'Stranger In The Middle' });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.booking.bookingId).toContain('BK-');
      expect(res.body.data.session.status).toBe('booked');
    });

    it('POST /api/sessions/:id/reset should reset session seating', async () => {
      const res = await request(app).post(`/api/sessions/${createdSessionId}/reset`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.session.status).toBe('ready');
      expect(res.body.data.session.winningSeats.length).toBe(0);
    });
  });

  describe('Views', () => {
    it('GET / should render the home page with EJS', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.text).toContain('Stranger In The Middle');
      expect(res.text).toContain('Spider-Man: Beyond the Spider-Verse');
    });

    it('GET /session/:id should render session view', async () => {
      const res = await request(app).get('/session/spiderman-test');
      expect(res.statusCode).toBe(200);
      expect(res.text).toContain('Stranger In The Middle');
    });
  });

  describe('Seat Optimization Algorithm Unit Tests', () => {
    it('scoreSeatBlock should give higher score to center front seats than side back seats', () => {
      // Row 0, cols 3, 4 (center) -> idx 3, 4
      const centerFront = [3, 4];
      // Row 5, cols 0, 1 (far side, back row) -> idx 40, 41
      const sideBack = [40, 41];

      const scoreCenter = scoreSeatBlock(centerFront);
      const scoreBack = scoreSeatBlock(sideBack);

      expect(scoreCenter).toBeGreaterThan(scoreBack);
    });

    it('findBestBlocks should return contiguous blocks of specified size', () => {
      const available = new Array(TOTAL_SEATS).fill(true);
      const blocks = findBestBlocks(available, 4);

      expect(blocks.length).toBeLessThanOrEqual(3);
      expect(blocks.length).toBeGreaterThan(0);
      expect(blocks[0].seats.length).toBe(4);
    });
  });

  describe('Error Handling', () => {
    it('GET /api/nonexistent should return 404 JSON', async () => {
      const res = await request(app).get('/api/nonexistent-endpoint');
      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe('fail');
    });
  });
});
