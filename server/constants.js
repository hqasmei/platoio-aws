const PASSWORD_HASH_SALT_ROUNDS = 10
const REDACT_FIELDS = ["Password", "PasswordHash"]
const REDACT_TEXT = "****************"
const LIMIT = 250

module.exports = {
  PASSWORD_HASH_SALT_ROUNDS,
  REDACT_FIELDS,
  REDACT_TEXT,
  LIMIT,
}
