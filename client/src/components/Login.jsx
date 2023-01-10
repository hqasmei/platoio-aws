import logo from "../assets/logo.png"

import _ from "lodash"

import React, { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useQueryClient } from "react-query"

import { Formik } from "formik"

import * as Yup from "yup"
import * as Eui from "@elastic/eui"

import * as api from "../api"
import * as constants from "../constants"

import { Error } from "./Error"

export const Login = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [error, setError] = useState(null)

  const mountedRef = useRef(false)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const handleSubmit = (values, { setSubmitting }) => {
    const { email, password } = values

    api
      .login(email, password)
      .then(() => {
        // IMPORTANT: Can't rely on the route stored in local storage upon login (see api.js),
        // because it's not always readable yet in this promise, presumably because the write to local storage
        // will not complete until the promise has returned, which is _after_ this handler returns.
        // So push to LOCATIONS directly here -- which means this code will need to stay in sync with the code in api.js.
        navigate(constants.ROUTE_HOME)
      })
      .catch((error) => {
        setError(error)
      })
      .finally(() => {
        if (mountedRef.current) setSubmitting(false)
        queryClient.invalidateQueries()
      })
  }

  const handleCancel = () => {
    navigate(-1)
  }

  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address.")
      .required("Email address is required."),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters.")
      .required("Password is required."),
  })

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={loginSchema}
      onSubmit={handleSubmit}
    >
      {({
        errors,
        values,
        dirty,
        isValid,
        isSubmitting,
        handleBlur,
        handleChange,
        handleSubmit,
      }) => (
        <Eui.EuiPageTemplate>
          <Eui.EuiPageTemplate.EmptyPrompt
            paddingSize="l"
            title={
              <Eui.EuiTitle>
                <h2>PlatoIO</h2>
              </Eui.EuiTitle>
            }
            icon={<Eui.EuiIcon size="xxl" type={logo} />}
          >
            <Eui.EuiText>Sign in to go to your account.</Eui.EuiText>

            <Eui.EuiSpacer />

            <Eui.EuiForm component="form" onSubmit={handleSubmit}>
              <Error error={error} />

              <Eui.EuiFormRow
                label="Email Address"
                isInvalid={!_.isEmpty(errors.email)}
                error={errors.email}
              >
                <Eui.EuiFieldText
                  id="email"
                  name="email"
                  value={values.email || ""}
                  isInvalid={!_.isEmpty(errors.email)}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </Eui.EuiFormRow>

              <Eui.EuiSpacer size="s" />
              <Eui.EuiFormRow
                label="Password"
                isInvalid={!_.isEmpty(errors.password)}
                error={errors.password}
              >
                <Eui.EuiFieldPassword
                  id="password"
                  name="password"
                  type="dual"
                  value={values.password || ""}
                  isInvalid={!_.isEmpty(errors.password)}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </Eui.EuiFormRow>

              <Eui.EuiSpacer />

              <Eui.EuiFlexGroup
                responsive={true}
                gutterSize="s"
                justifyContent="center"
              >
                <Eui.EuiFlexItem grow={false}>
                  <Eui.EuiButton
                    type="submit"
                    disabled={isSubmitting || !dirty || !isValid}
                  >
                    Sign In
                  </Eui.EuiButton>
                </Eui.EuiFlexItem>

                <Eui.EuiFlexItem grow={false}>
                  <Eui.EuiButton disabled={isSubmitting} onClick={handleCancel}>
                    Cancel
                  </Eui.EuiButton>
                </Eui.EuiFlexItem>
              </Eui.EuiFlexGroup>

              <Eui.EuiSpacer />

              <Eui.EuiFlexGroup
                responsive
                gutterSize="s"
                justifyContent="center"
              >
                <Eui.EuiFlexItem grow>
                  <Eui.EuiText>
                    Don't have an account?&nbsp;&nbsp;
                    <Eui.EuiLink
                      onClick={() => navigate(constants.ROUTE_REGISTER)}
                    >
                      Sign Up
                    </Eui.EuiLink>
                  </Eui.EuiText>
                </Eui.EuiFlexItem>
              </Eui.EuiFlexGroup>
            </Eui.EuiForm>
          </Eui.EuiPageTemplate.EmptyPrompt>
        </Eui.EuiPageTemplate>
      )}
    </Formik>
  )
}
