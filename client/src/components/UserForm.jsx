import React from "react"

import _ from "lodash"

import * as Eui from "@elastic/eui"

export const UserForm = (props) => {
  const { values, errors, handleBlur, handleChange } = props

  return (
    <>
      <Eui.EuiFlexItem>
        <Eui.EuiFormRow
          label="Name"
          isInvalid={!_.isEmpty(errors.name)}
          error={errors.name}
        >
          <Eui.EuiFieldText
            id="name"
            name="name"
            value={values.name || ""}
            isInvalid={!_.isEmpty(errors.name)}
            onBlur={handleBlur}
            onChange={handleChange}
          />
        </Eui.EuiFormRow>
      </Eui.EuiFlexItem>
    </>
  )
}
