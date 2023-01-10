import _ from "lodash"

import axios from "axios"
import * as constants from "./constants"

import { writeStorage, deleteFromStorage } from "@rehooks/local-storage"

export const userLooksValid = (user) => {
  return _.isObject(user) && _.isString(user.Email) && !_.isEmpty(user.Email)
}

export const register = (name, email, password) => {
  return axios
    .post(constants.API_URL_REGISTER, {
      Name: name,
      Email: email,
      Password: password,
    })
    .then((res) => {
      // TODO: Is this the right place to do this, or would the login component be better?
      // This seems to tie the api to the presentation somewhat, so consider moving!
      writeStorage(constants.SESSION_KEY_USER, res.data.User)
      writeStorage(constants.SESSION_KEY_ROUTE, constants.ROUTE_HOME)
      return res.data
    })
}

export const login = (email, password) => {
  return axios
    .post("/api/v1/login", { Email: email, Password: password })
    .then((res) => {
      // TODO: Is this the right place to do this, or would the login component be better?
      // This seems to tie the api to the presentation somewhat, so consider moving!
      writeStorage(constants.SESSION_KEY_USER, res.data.User)
      writeStorage(constants.SESSION_KEY_ROUTE, constants.ROUTE_HOME)
      return res.data
    })
}

export const logout = () => {
  return axios
    .post(constants.API_URL_LOGOUT)
    .then((res) => {
      return res.data
    })
    .finally(() => {
      // TODO: Is this the right place to do this, or would the logout component be better?
      // This seems to tie the api to the presentation somewhat, so consider moving!
      deleteFromStorage(constants.SESSION_KEY_USER)
      deleteFromStorage(constants.SESSION_KEY_ROUTE)
    })
}

// Users.
export const updateUser = ({ id, user }) => {
  const url = encodeURI(`${constants.API_URL_USER}/${id}`)
  return axios.put(url, user).then((res) => {
    return res.data
  })
}

// Tasks.
export const getTasks = () => {
  return axios.get(constants.API_URL_TASK).then((res) => {
    return res.data
  })
}

export const getTask = (id) => {
  const url = encodeURI(`${constants.API_URL_TASK}/${id}`)
  return axios.get(url).then((res) => {
    return res.data
  })
}

export const createTask = (task) => {
  return axios.post(constants.API_URL_TASK, task).then((res) => {
    return res.data
  })
}

export const updateTask = ({ id, task }) => {
  const url = encodeURI(`${constants.API_URL_TASK}/${id}`)
  return axios.put(url, task).then((res) => {
    return res.data
  })
}

export const deleteTask = ({ id }) => {
  const url = encodeURI(`${constants.API_URL_TASK}/${id}`)
  return axios.delete(url).then((res) => {
    return res.data
  })
}

export const unDeleteTask = ({ id }) => {
  const url = encodeURI(`${constants.API_URL_TASK}/${id}`)
  return axios.patch(url).then((res) => {
    return res.data
  })
}
