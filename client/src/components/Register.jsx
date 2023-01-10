import logo from "../assets/logo.png"

import _ from "lodash"

import React, { useState } from "react"
import * as Eui from "@elastic/eui"
import { useNavigate } from "react-router-dom"
import { Formik } from "formik"
import * as Yup from "yup"

import * as api from "../api"
import * as constants from "../constants"

import { Error } from "./Error"

export const Register = () => {
  const navigate = useNavigate()

  const [error, setError] = useState(null)

  const registrationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required."),
    email: Yup.string()
      .email("Invalid email address.")
      .required("Email address is required."),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters.")
      .required("Password is required."),
  })

  const handleSubmit = (values, { setSubmitting }) => {
    const { name, email, password } = values

    api
      .register(name, email, password)
      .then(() => {
        navigate(constants.ROUTE_HOME)
      })
      .catch((error) => {
        setError(error)
      })
  }

  const handleCancel = () => {
    navigate(-1)
  }

  return (
    <Formik
      initialValues={{ name: "", email: "", password: "" }}
      validationSchema={registrationSchema}
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
            <Eui.EuiText>Sign up to create your account.</Eui.EuiText>

            <Eui.EuiSpacer />

            <Eui.EuiForm component="form" onSubmit={handleSubmit}>
              <Error error={error} />

              <Eui.EuiFormRow label="Name" id="name">
                <Eui.EuiFieldText
                  id="name"
                  name="name"
                  value={values.name || ""}
                  isInvalid={!_.isEmpty(errors.name)}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </Eui.EuiFormRow>

              <Eui.EuiFormRow label="Email" id="email">
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
              <Eui.EuiFormRow label="Password" id="password">
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
                    Sign Up
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
                    Already have an account?&nbsp;&nbsp;
                    <Eui.EuiLink
                      onClick={() => navigate(constants.ROUTE_LOGIN)}
                    >
                      Sign In
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
