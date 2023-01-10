const _ = require("lodash")
const mung = require("express-mung")

const log = require("./winston")

const { getOne } = require("./db")
const { Role, hasRole, hasAtLeastAdminRole } = require("./roles")

const { REDACT_FIELDS, REDACT_TEXT } = require("./constants")

// Make sure user is in session and in database.
// Must be the first middleware, because it puts the user in the response context.
const isAuthenticated = async (req, res, next) => {
  const userId = req.session.UserID
  if (!userId) {
    log.warn("Not authenticated. No user in session.")
    return res.status(401).send({ message: "Not authenticated." })
  }
  await getOne("select * from users where id = $1", userId)
    .then((user) => {
      if (hasRole(user, Role.NONE)) {
        log.warn("Not authenticated. User has role of none.")
        return res.status(401).send({ message: "Not authenticated." })
      }
      if (user.DeletedAt) {
        log.warn("Not authenticated. User is marked as deleted.")
        return res.status(401).send({ message: "Not authenticated." })
      }
      if (user.Token) {
        log.warn("Not authenticated. User has been invited or reset.")
        return res.status(401).send({ message: "Not authenticated." })
      } else {
        // Set the user in the session.
        res.locals.user = user
        log.debug("Authenticated.")
        next()
      }
    })
    .catch(() => {
      log.warn("Not authenticated. User not found.")
      return res.status(401).send({ message: "Not authenticated." })
    })
}

// This must be myself, or I must be an admin.
// Must come after isAuthenticated.
const selfOrAdmin = async (req, res, next) => {
  if (!res.locals.user) {
    log.error("No user in session.")
    return res.status(403).send({ message: "No user exists in the session." })
  }
  const user = res.locals.user
  if (hasAtLeastAdminRole(user)) {
    return next()
  }
  if (!req.params && !req.params.id) {
    log.error("User id is empty.")
    return res
      .status(403)
      .send({ message: "Must supply a user id to perform this operation." })
  }
  const userId = req.params.id
  if (userId !== user.ID) {
    log.error("User id differs and not admin.")
    return res
      .status(403)
      .send({ message: "Cannot access a user other than yourself." })
  }
  next()
}

// Can only act upon yourself.
// Must come after isAuthenticated.
const self = async (req, res, next) => {
  if (!res.locals.user) {
    log.error("No user in session.")
    return res.status(403).send({ message: "No user exists in the session." })
  }
  const user = res.locals.user
  if (!req.params && !req.params.id) {
    log.error("User id is empty.")
    return res
      .status(403)
      .send({ message: "Must supply a user id to perform this operation." })
  }
  const userId = req.params.id
  if (userId !== user.ID) {
    log.error(
      "User id does not match. Cannot operate on a user other than yourself."
    )
    return res.status(403).send({
      message: "Cannot perform this operation on a user other than yourself.",
    })
  }
  next()
}

// Cannot act upon yourself.
// Must come after isAuthenticated.
const notSelf = async (req, res, next) => {
  if (!res.locals.user) {
    log.error("No user in session.")
    return res.status(403).send({ message: "No user exists in the session." })
  }
  const user = res.locals.user
  if (!req.params && !req.params.id) {
    log.error("User id is empty.")
    return res
      .status(403)
      .send({ message: "Must supply a user id to perform this operation." })
  }
  const userId = req.params.id
  if (userId === user.ID) {
    log.error("User id matches. Cannot operate on yourself.")
    return res
      .status(403)
      .send({ message: "Cannot perform this operation on yourself." })
  }
  next()
}

const redact = (element, req, res) => {
  _.forEach(element, (value, key, element) => {
    if (_.isObjectLike(value)) {
      redact(value, req, res)
    }
    if (_.some(REDACT_FIELDS, (item) => _.eq(item, key))) {
      element[key] = REDACT_TEXT
    }
  })
}

// Redact any personal info from the response.
// Currently just passwords.
const formatResponse = mung.json(redact)

module.exports = {
  isAuthenticated,
  selfOrAdmin,
  self,
  notSelf,
  formatResponse,
}
