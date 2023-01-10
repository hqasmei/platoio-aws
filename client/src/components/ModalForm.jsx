import React from "react"

import { Formik } from "formik"

import {
  EuiModal,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiModalBody,
  EuiButtonEmpty,
  EuiButton,
  EuiModalFooter,
  EuiFlexGroup,
  EuiForm,
} from "@elastic/eui"

export const ModalForm = (props) => {
  const {
    visible,
    title,
    values,
    form,
    isSaving,
    schema,
    onConfirm,
    onCancel,
    modalFormId,
  } = props

  const confirm = (values) => {
    onConfirm(values)
    onCancel()
  }

  const cancel = () => {
    onCancel()
  }

  const widget = () => {
    if (visible) {
      return (
        <Formik
          initialValues={values}
          validationSchema={schema}
          onSubmit={confirm}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            isSubmitting,
            isValid,
            dirty,
          }) => (
            <EuiModal onClose={cancel}>
              <EuiModalHeader>
                <EuiModalHeaderTitle>
                  <h1>{title}</h1>
                </EuiModalHeaderTitle>
              </EuiModalHeader>

              <EuiForm
                component="form"
                id={modalFormId}
                onSubmit={handleSubmit}
              >
                <EuiModalBody>
                  <EuiFlexGroup>
                    {form({
                      values: values,
                      errors: errors,
                      handleBlur: handleBlur,
                      handleChange: handleChange,
                    })}
                  </EuiFlexGroup>
                </EuiModalBody>

                <EuiModalFooter>
                  <EuiButtonEmpty onClick={cancel}>Cancel</EuiButtonEmpty>

                  <EuiButton
                    type="submit"
                    form={modalFormId}
                    fill
                    disabled={isSubmitting || isSaving || !dirty || !isValid}
                  >
                    Save
                  </EuiButton>
                </EuiModalFooter>
              </EuiForm>
            </EuiModal>
          )}
        </Formik>
      )
    }
    return null
  }

  return <>{widget()}</>
}
