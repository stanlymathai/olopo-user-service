// Loads .env file contents.
require('dotenv').config();

const db = require('./configs/db.config.js');
const routes = require('./routes');

function main() {
  return new Promise(async (resolve, reject) => {
    try {
      await db.establishConnection();

      function app(req, res) {
        // Handle CORS preflight requests
        if (req.method === 'OPTIONS') {
          res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Authorization, Content-Type',
          });
          res.end();
          return;
        }

        // Apply CORS headers to all responses
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader(
          'Access-Control-Allow-Headers',
          'Authorization, Content-Type'
        );

        // Route handling
        routes(req, res);
      }

      module.exports = app;

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

// Execute the main method and handle any errors
main().catch((error) => {
  console.error('An error occurred:', error);
  process.exit(1);
});
