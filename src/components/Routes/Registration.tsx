// This file renders the registration screen.

import React, { useContext, useEffect, useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { RegistrationFlow } from '@oryd/kratos-client'
import Form from '../Form/Form'
import kratos from '../../helpers/sdk'
import StyledCard from '../Styled/StyledCard'
import NavigationCard from '../Styled/NavigationCard'
import AuthLayout from '../Layout/AuthLayout'
import AuthSubTitle from '../Styled/AuthSubTitle'
import { RootStackParamList } from '../Navigation'
import { AuthContext } from '../AuthProvider'
import { handleFormSubmitError } from '../../helpers/form'

type Props = StackScreenProps<RootStackParamList, 'Registration'>

const Registration = ({ navigation }: Props) => {
  const [config, setConfig] = useState<RegistrationFlow | undefined>(undefined)
  const { setSession } = useContext(AuthContext)

  const initializeFlow = () =>
    kratos
      .initializeSelfServiceRegistrationViaAPIFlow()
      // The flow was initialized successfully, let's set the form data:
      .then(({ data: flow }) => {
        setConfig(flow)
      })
      .catch(console.error)

  // When the component is mounted, we initialize a new use login flow:
  useEffect(() => {
    initializeFlow()
  }, [])

  if (!config) {
    return null
  }

  // This will update the registration flow with the user provided input:
  const onSubmit = (payload: object): Promise<void> =>
    kratos
      .completeSelfServiceRegistrationFlowWithPasswordMethod(config.id, payload)
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
        handleFormSubmitError<RegistrationFlow | undefined>(
          setConfig,
          initializeFlow
        )
      )

  return (
    <AuthLayout>
      <StyledCard>
        <AuthSubTitle>Create your ORY Demo account</AuthSubTitle>

        <Form
          config={config}
          method="password"
          submitLabel="Sign Up"
          onSubmit={onSubmit}
        />
      </StyledCard>

      <NavigationCard
        description="Already have an account?"
        cta="Sign in!"
        onPress={() => navigation.navigate('Login')}
      />
    </AuthLayout>
  )
}

export default Registration
