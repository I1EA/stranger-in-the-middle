/**
 * Wraps async route handlers to catch uncaught errors and forward to next()
 * @param {Function} fn - Async Express route handler
 * @returns {Function} Express middleware function
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;
