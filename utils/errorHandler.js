/**
 * Global Express Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';
  const message = err.message || 'Something went wrong on the server';

  // Log in non-test environments
  if (process.env.NODE_ENV !== 'test') {
    console.error(`[Error] ${statusCode} - ${message}`);
    if (statusCode === 500 && err.stack) {
      console.error(err.stack);
    }
  }

  // If the request accepts JSON or is an API request, return JSON
  if (req.originalUrl.startsWith('/api') || req.xhr || req.headers.accept?.includes('application/json')) {
    return res.status(statusCode).json({
      status,
      success: false,
      error: {
        statusCode,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      },
    });
  }

  // For HTML requests, render error response or send clean status
  res.status(statusCode).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Error ${statusCode}</title>
      <style>
        body { font-family: system-ui, sans-serif; background: #1a0a2e; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
        .box { background: #2d1a4a; padding: 32px; border-radius: 16px; text-align: center; max-width: 480px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        h1 { color: #ef4444; margin-bottom: 12px; }
        p { color: #cbd5e1; margin-bottom: 20px; font-size: 15px; }
        a { background: #cc0000; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 30px; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="box">
        <h1>Error ${statusCode}</h1>
        <p>${message}</p>
        <a href="/">Return Home</a>
      </div>
    </body>
    </html>
  `);
};

export default errorHandler;
