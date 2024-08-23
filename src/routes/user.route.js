const { verifyString } = require('../middlewares/auth.middleware.js');
const handler = require('../controllers/user.controller.js');
const globalErrorHandler = require('../handlers/globalError.handler.js');

module.exports = (req, res) => {
  const { method, url } = req;

  try {
    return verifyString(req, res, () => {
      if (url === '/users' && method === 'POST') {
        return handler.createUser(req, res);
      }

      const userIdMatch = url.match(/^\/users\/(\w+)$/);
      if (userIdMatch && method === 'GET') {
        const userId = userIdMatch[1];
        return handler.getUserById(req, res, userId);
      }

      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Not Found' }));
    });
  } catch (err) {
    globalErrorHandler(err, req, res);
  }
};
