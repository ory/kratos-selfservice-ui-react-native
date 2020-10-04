import 'react-native-gesture-handler';

import React from 'react';
import Navigation from "./src/components/Navigation";

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Registration: undefined;
  Logout: undefined;
}

export default function App() {
  return <Navigation />
}
