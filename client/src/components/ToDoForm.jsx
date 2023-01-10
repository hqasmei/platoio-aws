import React from "react"

import _ from "lodash"

import * as Eui from "@elastic/eui"

export const ToDoForm = (props) => {
  const { values, errors, handleBlur, handleChange } = props

  const options = [
    {
      value: "To Be Done",
      text: "To Be Done",
    },
    {
      value: "In Progress",
      text: "In Progress",
    },
    {
      value: "Done",
      text: "Done",
    },
  ]

  return (
    <>
      <Eui.EuiFlexItem>
        <Eui.EuiFormRow
          label="Task"
          isInvalid={!_.isEmpty(errors.task)}
          error={errors.task}
        >
          <Eui.EuiFieldText
            id="task"
            name="task"
            value={values.task || ""}
            isInvalid={!_.isEmpty(errors.task)}
            onBlur={handleBlur}
            onChange={handleChange}
          />
        </Eui.EuiFormRow>
      </Eui.EuiFlexItem>
      <Eui.EuiFlexItem>
        <Eui.EuiFormRow
          label="Status"
          isInvalid={!_.isEmpty(errors.status)}
          error={errors.status}
        >
          <Eui.EuiSelect
            name="status"
            options={options}
            value={values.status || ""}
            onBlur={handleBlur}
            onChange={(selectedOption) => {
              handleChange("status")(selectedOption)
            }}
          />
        </Eui.EuiFormRow>
      </Eui.EuiFlexItem>
    </>
  )
}
