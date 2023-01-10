const { check, validationResult } = require("express-validator")

const { getOne, getMany } = require("../db")
const { LIMIT } = require("../constants")

const createTaskValidator = [
  check("Task", "Task required.").notEmpty(),
  check("TaskStatus", "Status required.").notEmpty(),
]

const updateTaskValidator = [
  check("Task", "Task name required.").notEmpty(),
  check("TaskStatus", "Status required.").notEmpty(),
]

const handleViewTasks = async (req, res, next) => {
  let sql = "select * from tasks where user_id = $(session.UserID)"

  sql += " order by created_at desc limit $(limit)"
  await getMany(sql, { session: req.session, limit: LIMIT })
    .then((tasks) => res.send(tasks))
    .catch(next)
}

const handleViewTask = async (req, res, next) => {
  await getOne(
    "select * from tasks where id = $(params.id) and user_id = $(session.UserID)",
    req
  )
    .then((tasks) => res.send(tasks))
    .catch(next)
}

const handleCreateTask = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(errors)
  }
  await getOne(
    "insert into tasks(user_id, task, task_status) " +
      "values($(session.UserID), $(body.Task), $(body.TaskStatus)) returning *",
    { body: req.body, session: req.session }
  )
    .then((tasks) => res.send(tasks))
    .catch(next)
}

const handleUpdateTask = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(errors)
  }
  await getOne(
    "update tasks set task = $(body.Task), task_status = $(body.TaskStatus)" +
      "where id = $(params.id) and user_id = $(session.UserID) returning *",
    req
  )
    .then((tasks) => res.send(tasks))
    .catch(next)
}

const handleDeleteTask = async (req, res, next) => {
  await getOne(
    "delete from tasks where id = $(params.id) " +
      "and user_id = $(session.UserID) returning *",
    req
  )
    .then((tasks) => res.send(tasks))
    .catch(next)
}

const handleUndeleteTask = async (req, res, next) => {
  await getOne(
    "update tasks set deleted_at = null where id = $(params.id) " +
      "and user_id = $(session.UserID) returning *",
    req
  )
    .then((tasks) => res.send(tasks))
    .catch(next)
}

module.exports = {
  createTaskValidator,
  updateTaskValidator,
  handleViewTasks,
  handleViewTask,
  handleCreateTask,
  handleUpdateTask,
  handleDeleteTask,
  handleUndeleteTask,
}
