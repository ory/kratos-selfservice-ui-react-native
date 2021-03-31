import 'react-native-gesture-handler'

import React from 'react'
import { ThemeProvider } from 'styled-components'
import { ThemeProvider as NativeThemeProvider } from 'styled-components/native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import * as Sentry from 'sentry-expo'
import { CaptureConsole } from '@sentry/integrations'

import { theme } from '@ory/themes'
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
import ProjectProvider from './src/components/ProjectProvider'

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

  const hydratedTheme = {
    ...theme,
    regularFont300: rubikLoaded ? 'Rubik_300Light' : 'Arial',
    regularFont400: rubikLoaded ? 'Rubik_400Regular' : 'Arial',
    regularFont500: rubikLoaded ? 'Rubik_500Medium' : 'Arial',
    codeFont400: robotoLoaded ? 'Roboto_400Regular' : 'Arial',
    platform: 'react-native'
  }

  return (
    <ThemeProvider theme={hydratedTheme}>
      <NativeThemeProvider theme={hydratedTheme}>
        <SafeAreaProvider>
          <SafeAreaView
            edges={['top', 'left', 'right']}
            style={{
              flex: 1,
              backgroundColor: theme.grey5
            }}
          >
            <ProjectProvider>
              <AuthProvider>
                <ErrorBoundary>
                  <Navigation />
                  <ForkMe />
                </ErrorBoundary>
              </AuthProvider>
            </ProjectProvider>
          </SafeAreaView>
        </SafeAreaProvider>
      </NativeThemeProvider>
    </ThemeProvider>
  )
}
