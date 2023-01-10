import React from "react"
import { EuiConfirmModal } from "@elastic/eui"

export const ConfirmDelete = (props) => {
  const { visible, title, onConfirm, onCancel } = props

  const confirm = () => {
    onConfirm()
  }

  const cancel = () => {
    onCancel()
  }

  const widget = () => {
    if (visible) {
      return (
        <EuiConfirmModal
          title={title}
          onConfirm={confirm}
          onCancel={cancel}
          cancelButtonText="Cancel"
          confirmButtonText="Delete"
          buttonColor="danger"
          defaultFocusedButton="confirm"
        >
          <p>You&rsquo;re about to delete this task.</p>
          <p>Are you sure you want to do this?</p>
        </EuiConfirmModal>
      )
    }
    return null
  }

  return <>{widget()}</>
}
