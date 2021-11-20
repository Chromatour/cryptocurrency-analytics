const { createLogger, format, transports } = require('winston');

const { combine, timestamp, prettyPrint } = format;

/**
 * Create new logger. Used methods for now: error, warning, info. Use 
 * error message as parameter.
 */

const logger = createLogger({
  format: combine(
    timestamp(),
    prettyPrint(),
  ),
  transports: [new transports.Console()],
});

module.exports = logger;
