import initServer from './server';
import { log } from './lib/utils/logger';

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
