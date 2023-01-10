const bcrypt = require("bcrypt")
const { check, validationResult } = require("express-validator")

const log = require("../winston")

const { getOne } = require("../db")

const { PASSWORD_HASH_SALT_ROUNDS } = require("../constants")

const registrationValidator = [
  check("Name", "Name required.").notEmpty(),
  check("Email", "Email address required.").notEmpty(),
  check("Email", "Not a valid email address.").isEmail(),
  check("Password", "Password required.").notEmpty(),
  check(
    "Password",
    "Password may only be composed of ASCII characters."
  ).isAscii(),
  check("Password", "Password must be 8 - 256 characters in length.").isLength({
    min: 8,
    max: 256,
  }),
]

const loginValidator = [
  check("Email", "Email address required.").notEmpty(),
  check("Email", "Not a valid email address.").isEmail(),
  check("Password", "Password required.").notEmpty(),
  check(
    "Password",
    "Password may only be composed of ASCII characters."
  ).isAscii(),
  check("Password", "Password must be 8 - 256 characters in length.").isLength({
    min: 8,
    max: 256,
  }),
]

const handleRegister = async (req, res, next) => {
  // Clear the existing session so that a failed
  // login attempt will leave the user logged-out.
  // Otherwise, it could be a security hole and
  // it might be unclear _who_ you're still logged in as.
  req.session.UserID = null

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(errors)
  }

  const passwordHash = bcrypt.hashSync(
    req.body.Password,
    PASSWORD_HASH_SALT_ROUNDS
  )

  await getOne(
    "insert into users(email, name, password_hash ) " +
      "values($(body.Email), $(body.Name), $(passwordHash)) returning *",
    { body: req.body, passwordHash: passwordHash }
  )
    .then((user) => {
      req.session.UserID = user.ID
      const session = { User: user }
      res.send(session)
    })
    .catch(next)
}

const handleLogin = async (req, res, next) => {
  // Clear the existing session so that a failed
  // login attempt will leave the user logged-out.
  // Otherwise, it could be a security hole and
  // it might be unclear _who_ you're still logged in as.
  req.session.UserID = null

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(errors)
  }

  await getOne("select * from users where email = $(Email)", req.body)
    .then((user) => {
      if (!passwordValid(req.body.Password, user.PasswordHash)) {
        log.debug("Incorrect password.")
        return res.status(401).send({ message: "Incorrect password." })
      }
      req.session.UserID = user.ID
      log.debug("Session created.")

      const data = { User: user }
      res.send(data)
    })
    .catch((error) => {
      return res.status(401).send({ message: "Incorrect email." })
    })
}

const handleLogout = async (req, res) => {
  req.session.UserID = null
  req.session.destroy()
  log.debug("User in session. Logged out.")
  res.send("")
}

const passwordValid = (plaintext, hashed) => {
  try {
    return bcrypt.compareSync(plaintext, hashed)
  } catch (error) {
    log.debug(`Error checking password: ${error.message}.`)
  }
  return false
}

module.exports = {
  registrationValidator,
  loginValidator,
  handleRegister,
  handleLogin,
  handleLogout,
}
