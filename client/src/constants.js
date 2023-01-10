// Session keys -- Anything saved to local storage SHOULD have a key defined here!
export const SESSION_KEY_USER = "user"
export const SESSION_KEY_ROUTE = "route"

// Edit modes.
export const EDIT_MODE_NONE = 'none'
export const EDIT_MODE_VIEWING = 'viewing'
export const EDIT_MODE_CREATING = 'creating'
export const EDIT_MODE_UPDATING = 'updating'
export const EDIT_MODE_DELETING = 'deleting'
export const EDIT_MODE_UNDELETING = 'undeleting'

// ReactQuery query keys.
export const QUERY_KEY_USER = "user"
export const QUERY_KEY_TASK = "task"

// API URLs.
export const API_URL_BASE = "/api/v1"
export const API_URL_REGISTER = API_URL_BASE + "/register"
export const API_URL_LOGIN = API_URL_BASE + "/login"
export const API_URL_LOGOUT = API_URL_BASE + "/logout"
export const API_URL_USER = API_URL_BASE + "/user"
export const API_URL_TASK = API_URL_BASE + "/task"

// Routes.
export const ROUTE_HOME = "/"
export const ROUTE_REGISTER = "/register"
export const ROUTE_LOGIN = "/login"
export const ROUTE_LOGOUT = "/logout"
export const ROUTE_USER = "/user"
export const ROUTE_TASK = "/task"

// Misc Constants.
export const REFETCH_INTERVAL = 60000
