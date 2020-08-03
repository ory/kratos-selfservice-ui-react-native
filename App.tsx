import 'react-native-gesture-handler';

import React from 'react';
import Entrypoint from "./src/components/Entrypoint";

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Registration: undefined;
  Logout: undefined;
}

export default function App() {
  return <Entrypoint />
}
