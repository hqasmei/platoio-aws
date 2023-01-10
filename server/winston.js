// winston.js
// TODO: Share with Admin.

const winston = require("winston")

// Define the custom settings for each transport (file, console)
// IMPORTANT: COLORIZE MUST COME BEFORE ANY OTHER FORMAT OPTIONS!
const options = {
  file: {
    level: "info",
    filename: "./app.log",
    tailable: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    format: winston.format.json(),
  },
  console: {
    level: "info",
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  },
}

// instantiate a new Winston Logger with the settings defined above
const logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console),
  ],
  exitOnError: false, // do not exit on handled exceptions
})

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function (message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message)
  },
}

module.exports = logger
