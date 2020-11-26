import 'react-native-gesture-handler'

import React from 'react'
import { Text } from 'react-native'
import { ThemeProvider } from 'styled-components/native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import * as Sentry from 'sentry-expo'
import { CaptureConsole } from '@sentry/integrations'

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

Sentry.init({
  dsn:
    'https://8be94c41dbe34ce1b244935c68165eab@o481709.ingest.sentry.io/5530799',
  enableInExpoDevelopment: true,
  debug: false,
  integrations: [
    new CaptureConsole({
      levels: ['error', 'warn', 'log']
    })
  ]
})

export default function App() {
  const [robotoLoaded] = useFontsRoboto({ Roboto_400Regular })
  const [rubikLoaded] = useFontsRubik({
    Rubik_300Light,
    Rubik_400Regular,
    Rubik_500Medium
  })

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
              regularFont300: rubikLoaded ? 'Rubik_300Light' : 'Arial',
              regularFont400: rubikLoaded ? 'Rubik_400Regular' : 'Arial',
              regularFont500: rubikLoaded ? 'Rubik_500Medium' : 'Arial',
              codeFont400: robotoLoaded ? 'Roboto_400Regular' : 'Arial',
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
