const util = require("util")
const pgp = require("pg-promise")({})
const { Result } = require("express-validator")
const { MulterError } = require("multer")

const log = require("../winston")

class HandlerError extends Error {
  constructor(message) {
    super(message)
    this.message = message
  }
}

const handleErrors = (err, req, res, next) => {
  log.info(`Handling error: ${util.inspect(err)}.`)

  // Our errors:
  if (err instanceof HandlerError) {
    return res.status(400).json({ message: err.message, code: 400 })
  }

  // express-validator errors:
  if (err instanceof Result) {
    return res.status(400).json({ message: err, code: 400 })
  }

  // Multer (form upload) errors:
  if (err instanceof MulterError) {
    return res.status(500).json({ message: err.message, code: 500 })
  }

  // Pg promise errors:
  if (err instanceof pgp.errors.QueryResultError) {
    if (
      err.code === pgp.errors.queryResultErrorCode.noData ||
      err.code === pgp.errors.queryResultErrorCode.multiple
    ) {
      return res.status(404).json({ message: "Not found.", code: 404 })
    }
    return res.status(500).json({ message: err.detail, code: 500 })
  }

  // Postgres errors:
  if (err.code && err.code === "23505" /* Duplicate key */) {
    return res.status(400).json({ code: err.code, message: "Already exists." })
  }

  // Parser errors:
  if (
    err.code &&
    err.code === "22P02" /* Invalid input syntax for type uuid */
  ) {
    return res
      .status(400)
      .json({ code: err.code, message: err.message || "Parser error." })
  }

  if (process.env.NODE_ENV === "development") {
    return res
      .status(500)
      .json({ code: err.code, message: err.message, stack: err.stack })
  }
  return res.status(500).json({ code: err.code, message: err.message })
}

module.exports = { HandlerError, handleErrors }
