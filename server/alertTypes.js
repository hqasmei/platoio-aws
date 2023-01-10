// REST AlertTypes.
// TODO: Share with Admin code.

const _ = require("lodash")

// NOTE: These must match the 'alert_type' enum wherever it is used.
const AlertType = {
  USER_AUTH_FAILED: { name: "user-auth-failed", text: "User Auth Failed" },
  INTERNAL_ERROR: { name: "internal-error", text: "Internal Error" },
}

const isValidAlertType = (type) => {
  try {
    if (!type) {
      return false
    }
    return _.some(AlertType, (a) => {
      return a.name === type.name
    })
  } catch (error) {
    return false
  }
}

const isValidAlertTypeName = (name) => {
  if (!name) {
    return false
  }
  return _.some(AlertType, (a) => {
    return a.name === name.toLowerCase()
  })
}

const getAlertTypeNames = () => {
  return _.map(AlertType, "name")
}

const getAlertTypeForName = (name) => {
  if (!name) {
    throw new Error("Null alert type name.")
  }
  if (!isValidAlertTypeName(name)) {
    throw new Error(`Invalid alert type name: ${name}`)
  }
  const type = _.find(AlertType, (a) => {
    return a.name === name.toLowerCase()
  })
  if (!type) {
    throw new Error(`Invalid alert type name: ${name}.`)
  }
  return type
}

module.exports = {
  AlertType,
  isValidAlertType,
  isValidAlertTypeName,
  getAlertTypeNames,
  getAlertTypeForName,
}
