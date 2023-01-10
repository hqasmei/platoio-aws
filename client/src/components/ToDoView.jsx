import React, { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "react-query"

import * as api from "../api"
import * as constants from "../constants"

import * as Yup from "yup"

import * as Eui from "@elastic/eui"

import { Error } from "./Error"
import { Loading } from "./Loading"
import { ConfirmDelete } from "./ConfirmDelete"
import { InPageForm } from "./InPageForm"
import { ModalForm } from "./ModalForm"
import { ToDoForm } from "./ToDoForm"

export const ToDoView = () => {
  const [taskItem, setTaskItem] = useState(null)
  const [mutationError, setMutationError] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [editMode, setEditMode] = useState(constants.EDIT_MODE_NONE)

  const queryClient = useQueryClient()
  const query = useQuery([constants.QUERY_KEY_TASK], () => api.getTasks())

  const mutationOptions = {
    onMutate: () => {
      setIsSaving(true)
    },
    onSuccess: () => {
      setMutationError(null)
      setEditMode(constants.EDIT_MODE_NONE)
      queryClient.invalidateQueries(constants.QUERY_KEY_TASK).then()
    },
    onError: (error) => {
      setMutationError(error)
    },
    onSettled: () => {
      setIsSaving(false)
    },
  }
  const deleteMutation = useMutation(api.deleteTask, mutationOptions)
  const updateMutation = useMutation(api.updateTask, mutationOptions)
  const createMutation = useMutation(api.createTask, mutationOptions)

  const handleSubmit = (values) => {
    const { task, status } = values
    const toCreate = {
      Task: task,
      TaskStatus: status,
    }
    createMutation.mutate(toCreate)
  }

  const handleUpdate = (values) => {
    const { task, status } = values
    const toUpdate = {
      Task: task,
      TaskStatus: status,
    }
    updateMutation.mutate({ id: taskItem.ID, task: toUpdate })
  }

  const handleDelete = () => {
    deleteMutation.mutate({ id: taskItem.ID })
  }

  const stopEditing = () => {
    setEditMode(constants.EDIT_MODE_NONE)
  }

  const actions = [
    {
      name: "Edit",
      description: "Edit this Task",
      icon: "pencil",
      type: "icon",
      color: "warning",
      onClick: (rowItem) => {
        setTaskItem(rowItem)
        setEditMode(constants.EDIT_MODE_UPDATING)
      },
    },
    {
      name: "Delete",
      description: "Delete this Task",
      icon: "trash",
      type: "icon",
      color: "danger",
      onClick: (rowItem) => {
        setTaskItem(rowItem)
        setEditMode(constants.EDIT_MODE_DELETING)
      },
    },
  ]

  const getColumns = () => {
    return [
      {
        field: "Task",
        name: "Task",
      },
      {
        field: "TaskStatus",
        name: "Status",
      },
      {
        name: "Actions",
        actions,
      },
    ]
  }

  const values = {
    task: taskItem ? taskItem.Task : "",
    status: taskItem ? taskItem.TaskStatus : "To Be Done",
  }

  const schema = Yup.object().shape({
    task: Yup.string().required("Task is required."),
    status: Yup.string().required("Status is required."),
  })

  const getToDoForm = (props) => {
    const { values, errors, handleBlur, handleChange } = props
    return ToDoForm({
      values: values,
      errors: errors,
      handleBlur: handleBlur,
      handleChange: handleChange,
    })
  }

  const widget = () => {
    if (query.isLoading) {
      return <Loading visible={query.isLoading} />
    }
    if (query.isError) {
      return <Error error={query.error} />
    }

    const queryData = query.data
    return (
      <>
        <ConfirmDelete
          visible={editMode === constants.EDIT_MODE_DELETING}
          title="Delete Task?"
          error={mutationError}
          isSaving={isSaving}
          onConfirm={handleDelete}
          onCancel={stopEditing}
        />
        <ModalForm
          visible={editMode === constants.EDIT_MODE_UPDATING}
          title="Update Task"
          values={values}
          form={getToDoForm}
          schema={schema}
          isSaving={isSaving}
          onConfirm={handleUpdate}
          onCancel={stopEditing}
          modalFormId="toDoModalForm"
        />

        <Eui.EuiFlexGroup>
          <Eui.EuiFlexItem>
            <InPageForm
              values={values}
              form={getToDoForm}
              schema={schema}
              isSaving={isSaving}
              handleSubmit={handleSubmit}
            />
          </Eui.EuiFlexItem>
        </Eui.EuiFlexGroup>
        <Eui.EuiSpacer size="l" />
        <Eui.EuiText>
          <h2>Tasks</h2>
        </Eui.EuiText>
        <Eui.EuiBasicTable
          tableCaption="Demo of EuiBasicTable"
          items={queryData}
          rowHeader="firstName"
          columns={getColumns()}
          responsive={true}
        />
      </>
    )
  }

  return widget()
}
