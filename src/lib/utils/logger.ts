import {
  createLogger, format, Logger, transports,
} from 'winston';

const {
  combine, timestamp, prettyPrint,
} = format;

/**
 * Create new logger. Used methods for now: error, warning, info. Use
 * error message as parameter.
 */

export const log: Logger = createLogger({
  format: combine(
    timestamp(),
    prettyPrint(),
  ),
  transports: [new transports.Console()],
});
