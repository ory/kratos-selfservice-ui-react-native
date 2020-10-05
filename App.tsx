import 'react-native-gesture-handler';

import React, { useEffect, useState } from 'react';
import Navigation from './src/components/Navigation';
import { ThemeProvider } from 'styled-components/native';
import { theme } from '@oryd/themes';
import ErrorBoundary from './src/components/ErrorBoundary';
import { Session } from '@oryd/kratos-client';
import { useFonts as useFontsRoboto } from '@expo-google-fonts/roboto/useFonts';
import { Roboto_400Regular } from '@expo-google-fonts/roboto';
import { useFonts as useFontsRubik } from '@expo-google-fonts/rubik/useFonts';
import {
  Rubik_300Light,
  Rubik_400Regular,
  Rubik_500Medium,
} from '@expo-google-fonts/rubik';
import { getAuthenticatedSession } from './src/helpers/auth';
import { AppLoading } from 'expo';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Registration: undefined;
  Logout: undefined;
};

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [robotoLoaded] = useFontsRoboto({ Roboto_400Regular });
  const [rubikLoaded] = useFontsRubik({
    Rubik_300Light,
    Rubik_400Regular,
    Rubik_500Medium,
  });

  // Fetches the authentication session.
  useEffect(() => {
    getAuthenticatedSession()
      .then(setSession)
      .then(() => setHasLoaded(true));
  }, []);

  if (!hasLoaded || !rubikLoaded || !robotoLoaded) {
    return <AppLoading />;
  }

  return (
    <ThemeProvider theme={theme}>
      <ErrorBoundary>
        <Navigation session={session} />
      </ErrorBoundary>
    </ThemeProvider>
  );
}
