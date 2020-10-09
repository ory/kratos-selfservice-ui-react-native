// This file renders the Login screen.

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
import { AxiosError } from 'axios'

type Props = StackScreenProps<RootStackParamList, 'Registration'>

const Registration = ({ navigation }: Props) => {
  const [config, setConfig] = useState<RegistrationFlow | undefined>(undefined)
  const { setSession } = useContext(AuthContext)
  const initializeFlow = () =>
    kratos
      .initializeSelfServiceRegistrationViaAPIFlow()
      .then(({ data: flow }) => {
        setConfig(flow)
      })
      .catch(console.error)

  useEffect(() => {
    initializeFlow()
  }, [])

  if (!config) {
    return null
  }

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

        return Promise.resolve({
          session: data.session,
          session_token: data.session_token
        })
      })
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
        <AuthSubTitle>Create your LoginApp account</AuthSubTitle>

        <Form
          config={config}
          method="password"
          submitLabel="Sign up"
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
