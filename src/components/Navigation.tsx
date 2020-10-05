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
