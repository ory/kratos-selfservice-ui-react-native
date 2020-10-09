import React, { ReactNode } from 'react'
import styled from 'styled-components/native'
import { ThemeProps } from '@oryd/themes'

import StyledText from './StyledText'

interface Props {
  children?: ReactNode
}

const StyledInnerText = styled(StyledText)`
  color: ${({ theme }: ThemeProps) => theme.primary60};
  margin-bottom: 15px;
  text-align: center;
`

export default ({ children }: Props) => (
  <StyledInnerText variant="h2">{children}</StyledInnerText>
)
