const mongoose = require('mongoose');
const config = require('./env.config/db.env');

const {
  db_name,
  db_host,
  db_username,
  db_password,
  db_socket_timeout,
  db_connection_timeout,
} = config;

mongoose.Promise = global.Promise;
const MONGO_CONN_URL = `mongodb+srv://${db_username}:${db_password}@${db_host}.mongodb.net/${db_name}?retryWrites=true&w=majority`;
const RETRY_BASE_INTERVAL = 2000; // 2 seconds base interval for exponential backoff retry
const MAX_RETRIES = 5; // Max number of retries for connection attempts

async function establishConnection(attempt = 1) {
  try {
    await mongoose.connect(MONGO_CONN_URL, {
      connectTimeoutMS: db_connection_timeout,
      socketTimeoutMS: db_socket_timeout,
    });
    console.log('DB connection established.');
  } catch (err) {
    console.error(
      `Failed to connect to db on attempt ${attempt}: ${err.message}`
    );

    if (attempt < MAX_RETRIES) {
      let exponential_backoff = RETRY_BASE_INTERVAL * Math.pow(2, attempt);
      let jitter = Math.random() * exponential_backoff * 0.5;
      let sleep_time = exponential_backoff + jitter;

      console.log(`Retrying in ${sleep_time / 1000} seconds...`);
      setTimeout(() => establishConnection(attempt + 1), sleep_time);
    } else {
      gracefulShutdown(new Error('Max connection retries reached.'));
    }
  }
}

mongoose.connection.on('error', (err) => {
  console.error('DB connection error:', err);
  gracefulShutdown(err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('DB connection lost.');
});

mongoose.connection.on('reconnected', () => {
  console.info('DB reconnected!');
});

mongoose.connection.on('reconnectFailed', () => {
  console.error('DB reconnection failed. Exiting...');
  gracefulShutdown(new Error('DB reconnection failed.'));
});

// Graceful shutdown
function gracefulShutdown(err) {
  console.error('Encountered an error:', err.message);
  console.info('Initiating graceful shutdown...');

  mongoose.connection
    .close()
    .then(() => {
      console.log('MongoDB connection closed due to app termination.');
      process.exit(1); // Exit with an error code to indicate failure
    })
    .catch((error) => {
      console.error('Error while closing MongoDB connection:', error);
      process.exit(1);
    });
}

// Shutdown process for signals
async function handleShutdown(signal) {
  console.log(`Received ${signal}. Closing MongoDB connection...`);
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed due to app termination.');
    process.exit(0);
  } catch (error) {
    console.error('Error while closing MongoDB connection:', error);
    process.exit(1);
  }
}

// Listen for shutdown signals
process.on('SIGINT', handleShutdown.bind(null, 'SIGINT'));
process.on('SIGTERM', handleShutdown.bind(null, 'SIGTERM'));

module.exports = { establishConnection };