import 'react-native-gesture-handler';
import Home from "./Home";

import React, {useState} from 'react';
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import Login from "./Login";
import Registration from "./Registration";
import Logout from "./Logout";
import {kratos} from '../config'
import {Session} from "@oryd/kratos-client";

const Stack = createStackNavigator<RootStackParamList>();

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Registration: undefined;
  Logout: undefined;
}

export default function Entrypoint() {
  const [hasSession, setSession] = useState<Session | undefined>(undefined)

  // Call ORY Kratos to check if we have a session!
  kratos.whoami({headers: {Authorization: 'Basic asdf'}})
    .then(({body}) => setSession(body))

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={hasSession ? "Home" : "Login"}>
        {hasSession ? (
          <>
            <Stack.Screen
              name="Home"
              component={Home}
              options={{title: 'Welcome'}}
            />
            <Stack.Screen
              name="Logout"
              component={Logout}
              options={{title: 'Log out'}}
            />
          </>
        ) : (
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
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
