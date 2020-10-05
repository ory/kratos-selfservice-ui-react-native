import React, { ReactNode } from 'react';
import styled from 'styled-components/native';
import { GridContainer, GridRow } from './Styled/Grid';
import { SafeAreaView, ScrollView } from 'react-native';

const StyledImage = styled.Image`
  margin-top: 55px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 16px;
  width: 189px;
  height: 44px;
`;

const Layout = ({ children }: { children: ReactNode }) => (
  <SafeAreaView>
    <ScrollView>
      <GridContainer>
        <GridRow>
          <StyledImage source={require('../assets/logo.png')} />
        </GridRow>
        {children}
      </GridContainer>
    </ScrollView>
  </SafeAreaView>
);

export default Layout;
