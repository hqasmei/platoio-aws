import React from "react"
import { useLocation } from "react-router-dom"
import { EuiCallOut, EuiText, EuiSpacer } from "@elastic/eui"

// import * as constants from "../constants"

export const NotFound = () => {
  const location = useLocation()

  return (
    <>
      <EuiCallOut
        size="m"
        title="The specified URL was not found:"
        color="danger"
        iconType="alert"
      >
        <EuiSpacer size="s" />
        <EuiText>
          <p>{location.pathname}</p>
        </EuiText>
        <EuiSpacer size="l" />
        <EuiText>
          <p>

            {/* <span>
              Click <a href={constants.ROUTE_USER}>here</a> to return to the
              dashboard.
            </span> */}
          </p>
        </EuiText>
      </EuiCallOut>
    </>
  )
}
