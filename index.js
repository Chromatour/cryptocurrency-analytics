const { initServer } = require('./server');
const { log } = require('./lib');

module.exports = (async () => {

  // Start server
  try {
    const server = await initServer();
    await server.start();
  } catch (error) {
    log.error('Error starting the server ', error);
    process.exit(1);
  }

  log.info('Service started successfully! ');
})();
