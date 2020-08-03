import 'react-native-gesture-handler';
import Home from "./components/Home";

import React, {useState} from 'react';
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import Login from "./components/Login";
import Registration from "./components/Registration";
import Logout from "./components/Logout";

const Stack = createStackNavigator<RootStackParamList>();

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Registration: undefined;
  Logout: undefined;
}

export default function App() {
  const [isSignedIn, setSignedIn] = useState(false)

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isSignedIn ? "Home" : "Login"}>
        {isSignedIn ? (
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
