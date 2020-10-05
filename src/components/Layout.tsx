import React, { ReactNode } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View`
  display: flex;
  flex: 1;
  background-color: ${({ theme }) => theme.grey5};
  alignitems: center;
  justifycontent: center;
  maxwidth: 375px;
  margin: 0 auto;
`;

const StyledImage = styled.Image`
  margintop: 55px;
  marginleft: auto;
  marginright: auto;
  marginbottom: 16px;
  width: 189px;
  height: 44px;
`;

const Layout = ({ children }: { children: ReactNode }) => (
  <Container>
    <View>
      <StyledImage source={require('../assets/logo.png')} />
    </View>
    {children}
  </Container>
);

export default Layout;
