import React, { ReactNode } from "react"
import styled from "styled-components/native"
import { GridContainer, GridRow } from "./Grid"
import { ScrollView } from "react-native"

const StyledImage = styled.Image`
  margin-top: 55px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 16px;
  width: 189px;
  height: 44px;
`

const AuthLayout = ({ children }: { children: ReactNode }) => (
  <ScrollView>
    <GridContainer>
      <GridRow>
        <StyledImage
          resizeMode="contain"
          source={require("../../assets/logo.png")}
        />
      </GridRow>
      {children}
    </GridContainer>
  </ScrollView>
)

export default AuthLayout
