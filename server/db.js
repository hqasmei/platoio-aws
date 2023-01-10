require("dotenv").config()
const _ = require("lodash")
const pgp = require("pg-promise")({})
const log = require("./winston")

const user = process.env.DB_USER || ""
const password = process.env.DB_PASSWORD || ""
const endpoint = process.env.DB_ENDPOINT || ""
const port = process.env.DB_PORT || 5432
const name = process.env.DB_NAME || ""
const cn = `postgresql://${user}:${password}@${endpoint}:${port}/${name}`

console.debug(`Connecting to DB at: ${endpoint}`)
const db = pgp(cn)

// Override the default node-postgres handling of timestamps,
// which is to convert them first to a JS date and then to string.
// This causes the ts to lose its microsecond resolution.
const types = pgp.pg.types
types.setTypeParser(types.builtins.TIMESTAMPTZ, (ts) => ts)

const connect = () => {
  db.connect()
    .then((obj) => {
      const version = obj.client.serverVersion
      obj.done()
      log.debug(`Postgres version: ${version}`)
    })
    .catch((error) => {
      log.error("DB CONNECTION ERROR: " + error.message || error)
    })
}

// IMPORTANT: ONLY CALL FROM TESTS.
// When running normally, express graceful shutdown already waits for natural close.
const disconnect = () => {
  db.$pool.end()
}

const getOne = async (sql, values) => {
  return db
    .one(sql, values)
    .then((one) => {
      return formatResult(one)
    })
    .catch((err) => {
      throw err
    })
}

const getOneOrNone = async (sql, values) => {
  return db
    .oneOrNone(sql, values)
    .then((one) => {
      return formatResult(one)
    })
    .catch((err) => {
      throw err
    })
}

const getMany = async (sql, values) => {
  return db
    .manyOrNone(sql, values)
    .then((many) => {
      return formatResult(many)
    })
    .catch((err) => {
      throw err
    })
}

const executeMany = async (statements) => {
  if (!_.isArray(statements)) {
    throw new Error("Must supply an array of statements to execute.")
  }
  if (statements.length === 0) {
    log.warning("executeMany() called with empty array -- ignoring.")
    return []
  }
  return db
    .tx(async (t) => {
      return t.batch(
        _.map(statements, async (statement) => {
          return await t.none(statement.statement, statement.values) // Do not return results -- too bulky.
        })
      )
    })
    .then((many) => {
      return formatResult(many)
    })
    .catch((err) => {
      throw err
    })
}

const formatResult = (res) => {
  if (res && _.isArray(res)) {
    return _.map(res, (item) => {
      return mapKeys(item)
    })
  } else {
    return mapKeys(res)
  }
}

// The config files used by Reflect agents use ProperCamelCase JSON keys,
// and any key names ending in `ID` will be upper-cased, though when `Id`
// is used as the start of a word only the `I` will be capitalized.
//
// To maintain some consistency and reduce confusion, this service expects all JSON bodies
// to use ProperCamelCaseWithID JSON keys.
//
// For example:
// "CorrectlyFormattedKey": "This key is correctly formatted.",
// "CorrectlyFormattedKeyWithID": "This key with ID is correctly formatted.",
// "ID": "This key with ID is correctly formatted.",
// "incorrectlyFormattedKey": "This key is INCORRECTLY formatted.",
// "incorrectly_formatted_key": "This key is INCORRECTLY formatted.",
// "IncorrectlyFormattedKeyWithId": "This key with ID is INCORRECTLY formatted."
// "id": "This key with ID is INCORRECTLY formatted.",
// "Id": "This key with ID is INCORRECTLY formatted.",
const mapKeys = (item) => {
  if (item) {
    const mapped = _.mapKeys(item, (value, key) => {
      const upper = _.upperFirst(_.camelCase(key))
      const pos = upper.lastIndexOf("Id")
      if (pos >= 0) {
        return upper.substring(0, pos) + "ID"
      } else {
        return upper
      }
    })
    return mapped
  }
}

module.exports = {
  connect,
  disconnect,
  getOne,
  getOneOrNone,
  getMany,
  executeMany,
}
