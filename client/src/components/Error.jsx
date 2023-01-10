import React from "react"
import { EuiSpacer, EuiCallOut } from "@elastic/eui"

import { getServerErrorMessage } from "../utils"

export function Error(props) {
  const { error } = props

  const widget = () => {
    if (error) {
      return (
        <>
          <EuiCallOut
            size="s"
            title={getServerErrorMessage(error)}
            color="danger"
            iconType="alert"
          />
          <EuiSpacer size="s" />
        </>
      )
    }
    return null
  }

  return widget()
}
