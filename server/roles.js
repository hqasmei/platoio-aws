// TODO: Share this with the client code.
const _ = require("lodash")

// NOTE: These must match the enums used in the role column in the users table.
const Role = {
  USER: { name: "user", value: 10 },
  NONE: { name: "none", value: 0 },
  UNKNOWN: { name: "unknown", value: -1 },
}

const isValidRole = (role) => {
  if (!role) {
    return false
  }
  return role === Role.USER.name || role === Role.NONE.name
}

const getRoleForName = (name) => {
  if (!name) {
    return Role.UNKNOWN
  }
  const role = _.toLower(name)

  if (Role.USER.name === role) {
    return Role.USER
  }
  if (Role.NONE.name === role) {
    return Role.NONE
  }
  return Role.UNKNOWN
}

const getRole = (user) => {
  if (!user) {
    return Role.UNKNOWN
  }
  if (!user.Role) {
    return Role.UNKNOWN
  }
  if (Role.USER.name === user.Role) {
    return Role.USER
  }
  if (Role.NONE.name === user.Role) {
    return Role.NONE
  }
  return Role.UNKNOWN
}

const hasRole = (user, Role) => {
  if (!user || !user.Role || !Role) {
    return false
  }
  return getRole(user) === Role
}

const hasUserRole = (user) => {
  return hasRole(user, Role.USER)
}

const hasNoneRole = (user) => {
  return hasRole(user, Role.NONE)
}

const hasUnknownRole = (user) => {
  return hasRole(user, Role.UNKNOWN)
}

const hasAtLeastUserRole = (user) => {
  return hasUserRole(user)
}

const hasPeerRole = (requestor, user) => {
  if (!requestor || !user) {
    return false
  }
  if (!requestor.Role || !user.Role) {
    return false
  }
  const requestorRole = getRole(requestor)
  const userRole = getRole(user)
  return requestorRole.value >= userRole.value
}

const permissibleRoles = (requestor, user) => {
  if (!hasPeerRole(requestor, user)) {
    return []
  }
  const requestorRole = getRole(requestor)
  return _.filter(Role, (role) => {
    return requestorRole.value >= role.value
  })
}

const hasPermissibleRole = (requestor, user, role) => {
  return !_.isNil(permissibleRoles(requestor, user).find(role))
}

module.exports = {
  Role,
  isValidRole,
  getRoleForName,
  getRole,
  hasRole,
  hasUserRole,
  hasNoneRole,
  hasUnknownRole,
  hasAtLeastUserRole,
  hasPeerRole,
  permissibleRoles,
  hasPermissibleRole,
}
