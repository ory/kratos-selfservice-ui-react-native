import 'react-native-gesture-handler';

import React from 'react';
import Navigation from './src/components/Navigation';
import { ThemeProvider } from 'styled-components/native';
import { theme } from '@oryd/themes';
import ErrorBoundary from './src/components/ErrorBoundary';
import Constants from 'expo-constants';

console.log({ Constants })

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Registration: undefined;
  Logout: undefined;
};

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <ErrorBoundary>
        <Navigation />
      </ErrorBoundary>
    </ThemeProvider>
  );
}
