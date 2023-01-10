import React from "react"
import ReactDOM from "react-dom/client"

import "@elastic/eui/dist/eui_theme_light.css"
import "./index.css"

import App from "./components/App"
import axios from "axios"

import { deleteFromStorage } from "@rehooks/local-storage"
import { EuiProvider } from "@elastic/eui"

import * as constants from "./constants"

// Axios config.
axios.defaults.timeout = 5000
axios.defaults.withCredentials = true // Must be set to true or cross-origin cookie storage will not work!
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL

// Add a request interceptor.
axios.interceptors.request.use(
  function (request) {
    // console.debug(`AXIOS REQUEST: METHOD: ${request.method}. URL: ${request.url}. Data: ${JSON.stringify(request.data)}`)
    return request
  },
  function (error) {
    console.error(
      `AXIOS REQUEST ERROR: METHOD: ${error.request.config.method}. URL: ${
        error.request.config.url
      }. Data: ${JSON.stringify(error.request.data)}`
    )
    return Promise.reject(error.request.data)
  }
)

// Add a response interceptor.
axios.interceptors.response.use(
  function (response) {
    // console.debug(`AXIOS RESPONSE: METHOD: ${response.config.method}. URL: ${response.config.url}. Data: ${JSON.stringify(response.data)}`)
    return response
  },
  function (error) {
    authCheck(error)
    if (error.response) {
      console.error(
        `AXIOS RESPONSE ERROR: METHOD: ${error.response.config.method}. URL: ${
          error.response.config.url
        }. Data: ${JSON.stringify(error.response.data)}`
      )
      return Promise.reject(error.response.data)
    } else {
      console.error(`AXIOS RESPONSE ERROR: ${error}`)
      return Promise.reject(error)
    }
  }
)

// If we receive a 401 Unauthorized,
// logout and redirect the user to the login page (which clearing the stores will accomplish).
function authCheck(error) {
  if (error && error.response && error.response.status === 401) {
    console.log("401 UNAUTHORIZED. Clearing stores.")
    clearLocalStorage()
    return error
  }
  // TODO: Is it necessary to log the user out in this case?
  // if (error && error.response && error.response.status === 500 &&
  //   error.response.data && error.response.data.includes('ECONNREFUSED')) {
  //   console.log('500 ECONNREFUSED. Clearing stores.')
  //   clearLocalStorage()
  //   return error
  // }
  // TODO: Is it necessary to log the user out in this case?
  // if (error && error.response && error.response.status === 500 &&
  //   error.response.data && error.response.data.includes('ERR_CONNECTION_REFUSED')) {
  //   console.log('500 ERR_CONNECTION_REFUSED. Clearing stores.')
  //   clearLocalStorage()
  //   return error
  // }
  return error
}

function clearLocalStorage() {
  deleteFromStorage(constants.SESSION_KEY_USER)
  deleteFromStorage(constants.SESSION_KEY_ROUTE)
}

console.debug(`API base url: ${axios.defaults.baseURL}`)

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <EuiProvider colorMode="light">
      <App />
  </EuiProvider>
)
