import React from "react"

import { Formik } from "formik"

import * as Eui from "@elastic/eui"

export const InPageForm = (props) => {
  const { values, form, schema, isSaving, handleSubmit } = props

  return (
    <Formik
      initialValues={values}
      validationSchema={schema}
      onSubmit={handleSubmit}
    >
      {({
        handleChange,
        handleBlur,
        values,
        errors,
        handleSubmit,
        isSubmitting,
        isValid,
        dirty,
      }) => (
        <Eui.EuiForm component="form" onSubmit={handleSubmit}>
          <Eui.EuiFlexGroup>
            {form({
              values: values,
              errors: errors,
              handleBlur: handleBlur,
              handleChange: handleChange,
            })}
            <Eui.EuiFlexItem>
              <Eui.EuiFormRow hasEmptyLabelSpace>
                <Eui.EuiButton
                  type="submit"
                  disabled={isSubmitting || isSaving || !dirty || !isValid}
                >
                  Submit
                </Eui.EuiButton>
              </Eui.EuiFormRow>
            </Eui.EuiFlexItem>
          </Eui.EuiFlexGroup>
        </Eui.EuiForm>
      )}
    </Formik>
  )
}
