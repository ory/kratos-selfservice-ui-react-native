import React, { ReactNode, useContext } from 'react'
import styled, { ThemeProps } from 'styled-components/native'
import { GridRow } from '../Layout/Grid'
import { TextProps } from 'react-native'
import { codeBoxStyles } from '@ory/themes'
import StyledText from './StyledText'
import { ThemeContext } from 'styled-components'

const StyledCodeBox = styled.View(codeBoxStyles)

interface Props extends TextProps {
  children: ReactNode
  testID?: string
}

export default ({ testID, ...props }: Props) => (
  <GridRow>
    <StyledCodeBox>
      <StyledText testID={testID} variant="code" {...props} />
    </StyledCodeBox>
  </GridRow>
)
