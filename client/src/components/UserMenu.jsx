import React, { useState } from "react"
import { useLocalStorage } from "@rehooks/local-storage"
import { useMutation, useQueryClient } from "react-query"

import {
  EuiAvatar,
  EuiFlexGroup,
  EuiFlexItem,
  EuiHeaderSectionItemButton,
  EuiLink,
  EuiPopover,
  EuiSpacer,
  EuiText,
  useGeneratedHtmlId,
} from "@elastic/eui"

import { useNavigate } from "react-router-dom"

import * as api from "../api"
import * as constants from "../constants"

import * as Yup from "yup"

import { ModalForm } from "./ModalForm"
import { UserForm } from "./UserForm"

export const UserMenu = () => {
  const navigate = useNavigate()
  const [user, setUser] = useLocalStorage(constants.SESSION_KEY_USER)
  const [editMode, setEditMode] = useState(constants.EDIT_MODE_NONE)
  const [isSaving, setIsSaving] = useState(false)

  const queryClient = useQueryClient()

  const mutationOptions = {
    onMutate: () => {
      setIsSaving(true)
    },
    onSuccess: (data) => {
      setEditMode(constants.EDIT_MODE_NONE)
      // If we've just updated ourself, update the user in local storage.
      if (data.ID === user.ID) {
        setUser(data)
      }
      queryClient.invalidateQueries(constants.QUERY_KEY_USER).then()
    },
    onSettled: () => {
      setIsSaving(false)
    },
  }
  const updateMutation = useMutation(api.updateUser, mutationOptions)

  const handleUpdate = (values) => {
    const { name } = values
    const toUpdate = {
      Name: name,
    }
    updateMutation.mutate({ id: user.ID, user: toUpdate })
  }

  const headerUserPopoverId = useGeneratedHtmlId({
    prefix: "headerUserPopover",
  })
  const [isOpen, setIsOpen] = useState(false)

  const onMenuButtonClick = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  const logout = () => {
    api.logout().then()
    navigate(constants.ROUTE_LOGIN)
  }

  const editProfile = () => {
    setEditMode(constants.EDIT_MODE_UPDATING)
  }

  const stopEditing = () => {
    setEditMode(constants.EDIT_MODE_NONE)
  }

  const values = {
    name: user ? user.Name : "",
  }

  const schema = Yup.object().shape({
    name: Yup.string().required("Name is required."),
  })

  const getUserName = () => {
    if (user) {
      return user.Name || user.Email
    }
    return ""
  }

  const getUserForm = (props) => {
    const { values, errors, handleBlur, handleChange } = props
    return UserForm({
      values: values,
      errors: errors,
      handleBlur: handleBlur,
      handleChange: handleChange,
    })
  }

  const button = (
    <EuiHeaderSectionItemButton
      aria-controls={headerUserPopoverId}
      aria-expanded={isOpen}
      aria-haspopup="true"
      aria-label="Account menu"
      onClick={onMenuButtonClick}
    >
      <EuiAvatar name={getUserName()} size="s" />
    </EuiHeaderSectionItemButton>
  )

  return (
    <>
      <ModalForm
        visible={editMode === constants.EDIT_MODE_UPDATING}
        title="Update Profile"
        values={values}
        form={getUserForm}
        schema={schema}
        isSaving={isSaving}
        onConfirm={handleUpdate}
        onCancel={stopEditing}
        modalFormId="userModalForm"
      />

      <EuiPopover
        id={headerUserPopoverId}
        button={button}
        isOpen={isOpen}
        anchorPosition="downRight"
        closePopover={closeMenu}
        panelPaddingSize="none"
      >
        <div style={{ width: 320 }}>
          <EuiFlexGroup
            gutterSize="m"
            className="euiHeaderProfile"
            responsive={false}
          >
            <EuiFlexItem grow={false}>
              <EuiAvatar name={getUserName()} size="xl" />
            </EuiFlexItem>

            <EuiFlexItem>
              <EuiText>
                <p>{getUserName()}</p>
              </EuiText>

              <EuiSpacer size="m" />

              <EuiFlexGroup>
                <EuiFlexItem>
                  <EuiFlexGroup justifyContent="spaceBetween">
                    <EuiFlexItem grow={false}>
                      <EuiLink onClick={editProfile}>Edit profile</EuiLink>
                    </EuiFlexItem>

                    <EuiFlexItem grow={false}>
                      <EuiLink onClick={logout}>Log out</EuiLink>
                    </EuiFlexItem>
                  </EuiFlexGroup>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlexItem>
          </EuiFlexGroup>
        </div>
      </EuiPopover>
    </>
  )
}
