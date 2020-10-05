import 'react-native-gesture-handler';

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Session } from '@oryd/kratos-client';

import Login from './Login';
import Registration from './Registration';
import Home from './Home';
import { getAuthenticatedSession } from '../helpers/auth';
import { AppLoading } from 'expo';
import {
  useFonts as useFontsRoboto,
  Roboto_400Regular,
} from '@expo-google-fonts/roboto';
import {
  useFonts as useFontsRubik,
  Rubik_300Light,
  Rubik_400Regular,
  Rubik_500Medium,
} from '@expo-google-fonts/rubik';

const Stack = createStackNavigator<RootStackParamList>();

export type RootStackParamList = {
  Home: { session: Session };
  Login: undefined;
  Registration: undefined;
};

export default function Navigation() {
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
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={session ? 'Home' : 'Login'}
        screenOptions={{
          headerShown: false,
        }}
      >
        {session ? (
          // If a session is available, we render the following screens only:
          <>
            <Stack.Screen
              name="Home"
              component={Home}
              options={{ title: 'Welcome' }}
            />
          </>
        ) : (
          // If a session is not available, we render the login, registration, ... screens:
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Registration" component={Registration} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
