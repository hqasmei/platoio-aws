import React from "react"
import * as Eui from "@elastic/eui"
import logo from "../assets/logo.png"

import { ToDoView } from "./ToDoView"
import { UserMenu } from "./UserMenu"

export const Dashboard = () => {
  return (
    <>
      <Eui.EuiHeader>
        <Eui.EuiHeaderSection>
          <Eui.EuiHeaderSectionItem border="right">
            <Eui.EuiHeaderLogo iconType={logo}>PlatoIO</Eui.EuiHeaderLogo>
          </Eui.EuiHeaderSectionItem>
        </Eui.EuiHeaderSection>

        <Eui.EuiHeaderSection side="right">
          <Eui.EuiHeaderSectionItem>
            <UserMenu />
          </Eui.EuiHeaderSectionItem>
        </Eui.EuiHeaderSection>
      </Eui.EuiHeader>

      <Eui.EuiPageTemplate>
        <Eui.EuiPageTemplate.Section>
          <ToDoView />
          <Eui.EuiPageTemplate.BottomBar paddingSize="m">
            <Eui.EuiText color="ghost" textAlign="center">
              <p>PlatoIO © 2022</p>
            </Eui.EuiText>
          </Eui.EuiPageTemplate.BottomBar>
        </Eui.EuiPageTemplate.Section>
      </Eui.EuiPageTemplate>
    </>
  )
}
