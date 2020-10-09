import React, { ReactNode } from 'react'
import styled from 'styled-components/native'
import { GridContainer, GridRow } from './Grid'
import { SafeAreaView, ScrollView } from 'react-native'
import ForkMe from '../Styled/ForkMe'

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
        <StyledImage source={require('../../assets/logo.png')} />
      </GridRow>
      {children}
    </GridContainer>
  </ScrollView>
)

export default AuthLayout
