import winston from "winston";

// Create an instance of the Winston logger
export const logger = winston.createLogger({
    format: winston.format.combine(winston.format.printf((info) => {
      if (typeof info.message === 'object') {
        info.message = JSON.stringify(info.message, null, 3)
      }
      return info.message
    }),
      winston.format.timestamp(),
      winston.format.splat(),
      winston.format.align(),
      winston.format.json(),
      winston.format.colorize({ all: true }),
      winston.format.simple()
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
    ],
  });

