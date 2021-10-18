import 'react-native-gesture-handler'

import React, { useContext } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import Login from './Routes/Login'
import Registration from './Routes/Registration'
import Home from './Routes/Home'
import { AuthContext } from './AuthProvider'
import Settings from './Routes/Settings'
import FlashMessage from 'react-native-flash-message'
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import Header from './Layout/Header'

const Stack = createStackNavigator<RootStackParamList>()

export type RootStackParamList = {
  Home: undefined
  Login: {
    refresh?: boolean
    aal?: 'aal2'
  }
  Registration: undefined
  Settings: undefined
}

const options = {
  header: () => <Header />
}

const linking = {
  // This is only used for e2e testing.
  prefixes: ['http://127.0.0.1:4457/']
}

export default () => {
  // import { AuthContext } from './AuthProvider'
  const { isAuthenticated } = useContext(AuthContext)
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <NavigationContainer linking={linking}>
          <Stack.Navigator
            screenOptions={{
              headerShown: isAuthenticated
            }}
          >
            <Stack.Screen name="Home" component={Home} options={options} />
            <Stack.Screen
              name="Settings"
              component={Settings}
              options={options}
            />
            <Stack.Screen name="Registration" component={Registration} />
            <Stack.Screen name="Login" component={Login} initialParams={{}} />
          </Stack.Navigator>
        </NavigationContainer>
      </TouchableWithoutFeedback>
      <View data-testid={'flash-message'}>
        <FlashMessage position="top" floating />
      </View>
    </KeyboardAvoidingView>
  )
}
