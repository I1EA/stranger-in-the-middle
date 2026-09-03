import request from 'supertest';
import app from '../app.js';

describe('WebMCP Group Session & Voting Flow API', () => {
  let sessionId;

  test('creates a group session with valid movie and groupSize', async () => {
    const res = await request(app)
      .post('/api/sessions')
      .send({ movieId: 'spiderman', groupSize: 4, organizerName: 'Agent Alice' });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('success');
    expect(res.body.data.session).toBeDefined();
    expect(res.body.data.session.id).toBeDefined();
    expect(res.body.data.session.movieId).toBe('spiderman');
    expect(res.body.data.session.groupSize).toBe(4);
    expect(res.body.data.session.suggestions.length).toBeGreaterThan(0);
    expect(res.body.data.session.status).toBe('ready');

    sessionId = res.body.data.session.id;
  });

  test('retrieves session state for an existing session', async () => {
    const res = await request(app).get(`/api/sessions/${sessionId}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.session.id).toBe(sessionId);
    expect(res.body.data.session.status).toBe('ready');
    expect(res.body.data.session.suggestions).toBeDefined();
    expect(res.body.data.session.voteCounts).toBeDefined();
  });

  test('starts group voting countdown', async () => {
    const res = await request(app)
      .post(`/api/sessions/${sessionId}/start-voting`)
      .send({ durationSeconds: 60 });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.session.status).toBe('voting');
    expect(res.body.data.session.timerSeconds).toBe(60);
  });

  test('casts a valid vote for an option', async () => {
    const res = await request(app)
      .post(`/api/sessions/${sessionId}/vote`)
      .send({ optionIndex: 0, voterName: 'Agent Bob' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.votedOptionIndex).toBe(0);
    expect(res.body.data.voteCounts[0]).toBeGreaterThanOrEqual(1);
    expect(res.body.data.session).toBeDefined();
  });

  test('rejects an invalid optionIndex with 400 Bad Request', async () => {
    const resNegative = await request(app)
      .post(`/api/sessions/${sessionId}/vote`)
      .send({ optionIndex: -1 });
    expect(resNegative.status).toBe(400);

    const resOverflow = await request(app)
      .post(`/api/sessions/${sessionId}/vote`)
      .send({ optionIndex: 99 });
    expect(resOverflow.status).toBe(400);

    const resNaN = await request(app)
      .post(`/api/sessions/${sessionId}/vote`)
      .send({ optionIndex: 'invalid' });
    expect(resNaN.status).toBe(400);
  });

  test('handles an invalid or nonexistent sessionId with 404 Not Found', async () => {
    const nonExistentId = 'non_existent_session_999';

    const getRes = await request(app).get(`/api/sessions/${nonExistentId}`);
    expect(getRes.status).toBe(404);

    const voteRes = await request(app)
      .post(`/api/sessions/${nonExistentId}/vote`)
      .send({ optionIndex: 0 });
    expect(voteRes.status).toBe(404);

    const startVoteRes = await request(app)
      .post(`/api/sessions/${nonExistentId}/start-voting`)
      .send({ durationSeconds: 60 });
    expect(startVoteRes.status).toBe(404);
  });

  test('executes end-to-end full agent flow: create -> get_state -> start_voting -> cast_votes -> verify consensus', async () => {
    // 1. Agent creates session
    const createRes = await request(app)
      .post('/api/sessions')
      .send({ movieId: 'dune2', groupSize: 2 });
    expect(createRes.status).toBe(201);
    const flowSessionId = createRes.body.data.session.id;

    // 2. Agent inspects state
    const state1 = await request(app).get(`/api/sessions/${flowSessionId}`);
    expect(state1.body.data.session.status).toBe('ready');

    // 3. Agent starts voting
    const startRes = await request(app)
      .post(`/api/sessions/${flowSessionId}/start-voting`)
      .send({ durationSeconds: 90 });
    expect(startRes.body.data.session.status).toBe('voting');

    // 4. Agent casts vote 1
    const vote1 = await request(app)
      .post(`/api/sessions/${flowSessionId}/vote`)
      .send({ optionIndex: 0, voterId: 'voter_1', voterName: 'Friend 1' });
    expect(vote1.status).toBe(200);

    // 5. Agent casts vote 2 (groupSize = 2, so auto ends voting upon full group vote)
    const vote2 = await request(app)
      .post(`/api/sessions/${flowSessionId}/vote`)
      .send({ optionIndex: 0, voterId: 'voter_2', voterName: 'Friend 2' });
    expect(vote2.status).toBe(200);

    // 6. Agent verifies consensus
    const finalState = await request(app).get(`/api/sessions/${flowSessionId}`);
    expect(finalState.body.data.session.status).toBe('ended');
    expect(finalState.body.data.session.winnerOptionIndex).toBe(0);
    expect(finalState.body.data.session.winningSeats.length).toBe(2);

    // 7. Agent can book winning seats
    const bookRes = await request(app)
      .post(`/api/sessions/${flowSessionId}/book`)
      .send({ bookedBy: 'SITM AI Agent' });
    expect(bookRes.status).toBe(200);
    expect(bookRes.body.data.booking.bookingId).toMatch(/^SITM-/);
    expect(bookRes.body.data.session.status).toBe('booked');
  });
});
