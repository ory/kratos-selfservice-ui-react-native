import 'react-native-gesture-handler'

import React, {useEffect, useState} from 'react'
import {NavigationContainer} from "@react-navigation/native"
import {createStackNavigator} from "@react-navigation/stack"
import {Session} from "@oryd/kratos-client"

import Login from "./Login"
import Registration from "./Registration"
import Home from "./Home"
import { getAuthenticatedSession } from '../helpers/auth';

const Stack = createStackNavigator<RootStackParamList>();

export type RootStackParamList = {
  Home: { session: Session };
  Login: undefined;
  Registration: undefined;
}

export default function Navigation() {
  const [session, setSession] = useState<Session | null>(null)

  // Fetches the authentication session.
  useEffect(() => {
    getAuthenticatedSession().then(setSession)
  })

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={session ? "Home" : "Login"}>
        {
          session ? (
          // If a session is available, we render the following screens only:
          <>
            <Stack.Screen
              name="Home"
              component={Home}
              options={{title: 'Welcome'}}
            />
          </>
        ) : (
          // If a session is not available, we render the login, registration, ... screens:
          <>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{title: 'Log in'}}
            />
            <Stack.Screen
              name="Registration"
              component={Registration}
              options={{title: 'Sign up'}}
            />
          </>
        )
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
}
