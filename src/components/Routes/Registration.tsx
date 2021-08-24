// This file renders the registration screen.

import React, { useContext, useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { useFocusEffect } from '@react-navigation/native'
import { SelfServiceFlow } from '../Ory/Ui'
import { newKratosSdk } from '../../helpers/sdk'
import StyledCard from '../Styled/StyledCard'
import NavigationCard from '../Styled/NavigationCard'
import AuthLayout from '../Layout/AuthLayout'
import AuthSubTitle from '../Styled/AuthSubTitle'
import { RootStackParamList } from '../Navigation'
import { AuthContext } from '../AuthProvider'
import { getNodeId, handleFormSubmitError } from '../../helpers/form'
import { Platform } from 'react-native'
import ProjectPicker from '../Layout/ProjectPicker'
import { ProjectContext } from '../ProjectProvider'
import {
  SelfServiceRegistrationFlow,
  SubmitSelfServiceRegistrationFlowBody
} from '@ory/kratos-client'

type Props = StackScreenProps<RootStackParamList, 'Registration'>

const Registration = ({ navigation }: Props) => {
  const [flow, setConfig] = useState<SelfServiceRegistrationFlow | undefined>(
    undefined
  )
  const { project } = useContext(ProjectContext)
  const { setSession, isAuthenticated } = useContext(AuthContext)

  const initializeFlow = () =>
    newKratosSdk(project)
      .initializeSelfServiceRegistrationFlowWithoutBrowser()
      // The flow was initialized successfully, let's set the form data:
      .then(({ data: flow }) => {
        setConfig(flow)
      })
      .catch(console.error)

  // When the component is mounted, we initialize a new use login flow:
  useFocusEffect(
    React.useCallback(() => {
      initializeFlow()

      return () => {
        setConfig(undefined)
      }
    }, [project])
  )

  if (isAuthenticated) {
    navigation.navigate('Home')
    return null
  }

  // This will update the registration flow with the user provided input:
  const onSubmit = (
    payload: SubmitSelfServiceRegistrationFlowBody
  ): Promise<void> =>
    flow
      ? newKratosSdk(project)
          .submitSelfServiceRegistrationFlow(flow.id, payload)
          .then(({ data }) => {
            // ORY Kratos can be configured in such a way that it requires a login after
            // registration. You could handle that case by navigating to the Login screen
            // but for simplicity we'll just print an error here:
            if (!data.session_token || !data.session) {
              const err = new Error(
                'It looks like you configured ORY Kratos to not issue a session automatically after registration. This edge-case is currently not supported in this example app. You can find more information on enabling this feature here: https://www.ory.sh/kratos/docs/next/self-service/flows/user-registration#successful-registration'
              )
              return Promise.reject(err)
            }

            // Looks like we got a session!
            return Promise.resolve({
              session: data.session,
              session_token: data.session_token
            })
          })
          // Let's log the user in!
          .then(setSession)
          .catch(
            handleFormSubmitError<SelfServiceRegistrationFlow | undefined>(
              setConfig,
              initializeFlow
            )
          )
      : Promise.resolve()

  return (
    <AuthLayout>
      <StyledCard>
        <AuthSubTitle>Create an account</AuthSubTitle>
        <SelfServiceFlow
          textInputOverride={(field, props) => {
            switch (getNodeId(field)) {
              case 'traits.email':
                return {
                  autoCapitalize: 'none',
                  autoCompleteType: 'email',
                  textContentType: 'username',
                  autoCorrect: false
                }
              case 'password':
                const iOS12Plus =
                  Platform.OS === 'ios' &&
                  parseInt(String(Platform.Version), 10) >= 12
                return {
                  textContentType: iOS12Plus ? 'newPassword' : 'password',
                  secureTextEntry: true
                }
            }
            return props
          }}
          flow={flow}
          onSubmit={onSubmit}
        />
      </StyledCard>

      <NavigationCard
        description="Already have an account?"
        cta="Sign in!"
        onPress={() => navigation.navigate({ key: 'Login' })}
      />

      <ProjectPicker />
    </AuthLayout>
  )
}

export default Registration
