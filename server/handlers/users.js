const { check, validationResult } = require("express-validator")
const { LIMIT } = require("../constants")

const { TOKEN_ALPHABET, TOKEN_LENGTH } = require("../constants")

const { getOne, getMany } = require("../db")
const { isValidRole, hasPeerRole } = require("../roles")
const { HandlerError } = require("./errors")

const inviteUserValidator = [
  check("Email", "Email address required.").notEmpty(),
  check("Name", "Name required.").notEmpty(),
  check("Email", "Not a valid email address.").isEmail(),
]

const updateUserValidator = [check("Name", "Name required.").notEmpty()]

const handleViewUsers = async (req, res, next) => {
  const sql =
    "select * from users " + " order by created_at desc limit $(limit)"
  await getMany(sql, { session: req.session, limit: LIMIT })
    .then((users) => res.send(users))
    .catch(next)
}

const handleViewUser = async (req, res, next) => {
  await getOne("select * from users where id = $(params.id)", req)
    .then((users) => res.send(users))
    .catch(next)
}

const handleUpdateUser = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(errors)
  }

  await getOne(
    "update users set name = $(body.Name) " +
      "where id = $(params.id) returning *",
    req
  )
    .then((user) => res.send(user))
    .catch(next)
}

const handleDeleteUser = async (req, res, next) => {
  const user = await getOne("select * from users where id = $(params.id)", req)
  if (!hasPeerRole(res.locals.user, user)) {
    throw new HandlerError("Requestor role insufficient.")
  }
  await getOne(
    "update users set deleted_at = now() where id = $(params.id) returning *",
    req
  )
    .then((user) => res.send(user))
    .catch(next)
}

const handleUndeleteUser = async (req, res, next) => {
  const user = await getOne("select * from users where id = $(params.id)", req)
  if (!hasPeerRole(res.locals.user, user)) {
    throw new HandlerError("Requestor role insufficient.")
  }
  await getOne(
    "update users set deleted_at = null where id = $(params.id) returning *",
    req
  )
    .then((user) => res.send(user))
    .catch(next)
}

module.exports = {
  inviteUserValidator,
  updateUserValidator,
  handleViewUsers,
  handleViewUser,
  handleUpdateUser,
  handleDeleteUser,
  handleUndeleteUser,
}
