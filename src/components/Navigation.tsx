import 'react-native-gesture-handler';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Session } from '@oryd/kratos-client';

import Login from './Routes/Login';
import Registration from './Routes/Registration';
import Home from './Routes/Home';

const Stack = createStackNavigator<RootStackParamList>();

export type RootStackParamList = {
  Home: {
    session: Session | null;
  };
  Login: undefined;
  Registration: undefined;
};

interface Props {
  session: Session | null;
}

export default ({ session }: Props) => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName={session ? 'Home' : 'Login'}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Registration" component={Registration} />
    </Stack.Navigator>
  </NavigationContainer>
);
