import StyledText from './StyledText';
import StyledCard from './StyledCard';
import React, { ReactNode, useContext } from 'react';
import { useTheme } from '@react-navigation/native';
import styled, { ThemeContext } from 'styled-components/native';
import { ThemeProps } from '@oryd/themes';

interface Props {
  children?: ReactNode;
}

const StyledInnerText = styled(StyledText)`
  color: ${({ theme }: ThemeProps) => theme.primary60};
  margin-bottom: 15px;
  text-align: center;
`;

export default ({ children }: Props) => (
  <StyledInnerText variant="h2">{children}</StyledInnerText>
);
