import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  const divider = '='.repeat(60);
  console.log(`\n${divider}`);
  console.log('   STRANGER IN THE MIDDLE (SITM)');
  console.log('   AI-Coordinated Group Cinema Seat Voting & Booking');
  console.log(divider);
  console.log(`   Server Running:   http://localhost:${PORT}`);
  console.log(`   Health Check:    http://localhost:${PORT}/api/health`);
  console.log(`   Movies API:       http://localhost:${PORT}/api/movies`);
  console.log(`   Sessions API:     http://localhost:${PORT}/api/sessions`);
  console.log(`   WebMCP Tools:     search_movies, get_available_seats, book_tickets, stranger_vote`);
  console.log(`   Environment:      ${process.env.NODE_ENV || 'development'}`);
  console.log(`${divider}\n`);
});

// Handle graceful shutdowns
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server process terminated.');
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server process terminated.');
    process.exit(0);
  });
});

export default server;
