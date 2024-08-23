const userRoutes = require('./user.route');
const globalErrorHandler = require('../handlers/globalError.handler');

module.exports = (req, res) => {
  const { method, url } = req;

  // Health check endpoint
  if (url === '/health' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('As Strong as an Ox!');
    return;
  }

  try {
    // User routes
    userRoutes(req, res);
  } catch (err) {
    globalErrorHandler(err, req, res);
  }
};
