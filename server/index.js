const express = require("express")
const session = require("express-session")
const morgan = require("morgan")
const cors = require("cors")

const pgSession = require("connect-pg-simple")(session)

// Required for async error handling.
// Just needs to be required before any handlers are invoked.
require("express-async-errors")

const log = require("./winston")
const { connect } = require("./db")

const { handleErrors } = require("./handlers/errors")

const { isAuthenticated, formatResponse } = require("./middleware")

const {
  registrationValidator,
  loginValidator,
  handleRegister,
  handleLogin,
  handleLogout,
} = require("./handlers/sessions")

const {
  updateUserValidator,
  handleViewUsers,
  handleViewUser,
  handleUpdateUser,
} = require("./handlers/users")

const {
  createTaskValidator,
  updateTaskValidator,
  handleViewTasks,
  handleViewTask,
  handleCreateTask,
  handleUpdateTask,
  handleDeleteTask,
  handleUndeleteTask,
} = require("./handlers/tasks")

const dbUser = process.env.DB_USER || ""
const dbPassword = process.env.DB_PASSWORD || ""
const dbEndpoint = process.env.DB_ENDPOINT || ""
const dbPort = process.env.DB_PORT || 5432
const dbName = process.env.DB_NAME || ""
const dbCn = `postgresql://${dbUser}:${dbPassword}@${dbEndpoint}:${dbPort}/${dbName}`
const sessionSecret =
  process.env.REST_SESSION_SECRET || "corbel-confound-flaw-pout-bondsman"
const sessionMaxAge = process.env.REST_SESSION_MAX_AGE || 86400000 // 24h/d * 60s/h * 60m/m * 1000ms/s  = 1 day in millis.
const sessionHttps = process.env.REST_SESSION_HTTPS || false // Use secure cookies in production!
const restPort = process.env.REST_PORT || 8080

const app = express()
const ws = require("express-ws")(app)

app.use(express.json({ limit: "512kb" }))
app.use(express.urlencoded({ extended: true }))
app.use(morgan("combined", { stream: log.stream }))
app.use(formatResponse)

// CORS.
const corsOptions = {
  origin: true,
  credentials: true,
}

app.use(cors(corsOptions))

// Sessions.
app.use(
  session({
    store: new pgSession({ conString: dbCn }),
    secret: sessionSecret,
    resave: false,
    httpOnly: true,
    saveUninitialized: false,
    cookie: {
      sameSite: "strict",
      secure: sessionHttps.toLowerCase === "true",
      maxAge: parseInt(sessionMaxAge),
    },
  })
)

// URL query parser.
app.set("query parser", (queryString) => {
  return new URLSearchParams(queryString)
})

// API Docs.
app.use("/apidoc", express.static("apidoc"))

// Health Check.
app.get("/", (req, res) => {
  res.status(200).end()
})

// IMPORTANT. MIDDLEWARE ORDER MATTERS.
// `isAuthenticated` must come before other middleware or handlers that access the session user,
// because `isAuthenticated` puts the user in the response context.

// Sessions.
app.post("/api/v1/register", registrationValidator, handleRegister)
app.post("/api/v1/login", loginValidator, handleLogin)
app.post("/api/v1/logout", isAuthenticated, handleLogout)

// Users.
app.get("/api/v1/user", isAuthenticated, handleViewUsers)
app.get("/api/v1/user/:id", isAuthenticated, handleViewUser)
app.put(
  "/api/v1/user/:id",
  updateUserValidator,
  isAuthenticated,
  handleUpdateUser
)

// Tasks.
app.get("/api/v1/task", isAuthenticated, handleViewTasks)
app.get("/api/v1/task/:id", isAuthenticated, handleViewTask)
app.post("/api/v1/task", createTaskValidator, isAuthenticated, handleCreateTask)
app.put(
  "/api/v1/task/:id",
  updateTaskValidator,
  isAuthenticated,
  handleUpdateTask
)
app.delete("/api/v1/task/:id", isAuthenticated, handleDeleteTask)
app.patch("/api/v1/task/:id", isAuthenticated, handleUndeleteTask)

// Error handler.
// MUST BE DEFINED AFTER ALL OTHER HANDLERS AND MIDDLEWARE.
app.use(handleErrors)

// Connect to the DB.
connect()

app.listen(restPort, () => {
  log.debug(`Listening at http://localhost:${restPort}`)
})
