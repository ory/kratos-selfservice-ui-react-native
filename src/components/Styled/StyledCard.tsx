import React, { ReactNode } from 'react';
import styled from 'styled-components/native';
import { GridRow } from './Grid';
import { ViewProps } from 'react-native';
import { ThemeProps } from '@oryd/themes';

const StyledCard = styled.View`
  padding: 20px;

  background-color: ${({ theme }: ThemeProps) => theme.grey0};
  border: 1px solid ${({ theme }: ThemeProps) => theme.grey10};
`;

interface Props extends ViewProps {
  children: ReactNode;
}

export default (props: Props) => (
  <GridRow>
    <StyledCard {...props} />
  </GridRow>
);
