import React from "react"
import * as Eui from "@elastic/eui"

export function Loading(props) {
  const { visible } = props

  const widget = () => {
    if (visible) {
      return (
        <>
          <Eui.EuiText>
            <b>Loading...</b>
          </Eui.EuiText>
          <Eui.EuiSpacer />
          <Eui.EuiLoadingContent lines={3} />
        </>
      )
    }
    return null
  }

  return widget()
}
