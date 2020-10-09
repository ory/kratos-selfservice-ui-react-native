import 'react-native-gesture-handler'

import React from 'react'
import { Text } from 'react-native'
import { ThemeProvider } from 'styled-components/native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

import { theme } from '@oryd/themes'
import {
  useFonts as useFontsRoboto,
  Roboto_400Regular
} from '@expo-google-fonts/roboto'
import {
  useFonts as useFontsRubik,
  Rubik_300Light,
  Rubik_400Regular,
  Rubik_500Medium
} from '@expo-google-fonts/rubik'

import Navigation from './src/components/Navigation'
import ErrorBoundary from './src/components/ErrorBoundary'
import AuthProvider from './src/components/AuthProvider'
import ForkMe from './src/components/Styled/ForkMe'

export default function App() {
  const [robotoLoaded] = useFontsRoboto({ Roboto_400Regular })
  const [rubikLoaded] = useFontsRubik({
    Rubik_300Light,
    Rubik_400Regular,
    Rubik_500Medium
  })

  if (!rubikLoaded || !robotoLoaded) {
    return <Text>Loading...</Text>
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView
        edges={['top', 'left', 'right']}
        style={{
          flex: 1,
          backgroundColor: theme.grey5
        }}
      >
        <AuthProvider>
          <ThemeProvider
            theme={{
              ...theme,
              regularFont300: 'Rubik_300Light',
              regularFont400: 'Rubik_400Regular',
              regularFont500: 'Rubik_500Medium',
              codeFont400: 'Roboto_400Regular',
              platform: 'react-native'
            }}
          >
            <ErrorBoundary>
              <Navigation />
              <ForkMe />
            </ErrorBoundary>
          </ThemeProvider>
        </AuthProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}
