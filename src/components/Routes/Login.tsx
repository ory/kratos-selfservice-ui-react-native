// This file renders the login screen.

import React, { useContext, useEffect, useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { LoginFlow } from '@oryd/kratos-client'
import Form from '../Form/Form'
import kratos from '../../helpers/sdk'
import StyledCard from '../Styled/StyledCard'
import AuthLayout from '../Layout/AuthLayout'
import NavigationCard from '../Styled/NavigationCard'
import AuthSubTitle from '../Styled/AuthSubTitle'
import { CompleteSelfServiceLoginFlowWithPasswordMethod } from '@oryd/kratos-client/api'
import { RootStackParamList } from '../Navigation'
import { AuthContext } from '../AuthProvider'
import { handleFormSubmitError } from '../../helpers/form'

type Props = StackScreenProps<RootStackParamList, 'Login'>

const Login = ({ navigation }: Props) => {
  const { setSession } = useContext(AuthContext)
  const [config, setConfig] = useState<LoginFlow | undefined>(undefined)

  const initializeFlow = () =>
    kratos
      .initializeSelfServiceLoginViaAPIFlow()
      .then(({ data: flow }) => {
        // The flow was initialized successfully, let's set the form data:
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

  // This will update the login flow with the user provided input:
  const onSubmit = (payload: CompleteSelfServiceLoginFlowWithPasswordMethod) =>
    kratos
      .completeSelfServiceLoginFlowWithPasswordMethod(config.id, payload)
      .then(({ data }) => Promise.resolve(data))
      // Looks like everything worked and we have a session!
      .then(setSession)
      .catch(handleFormSubmitError(setConfig, initializeFlow))

  return (
    <AuthLayout>
      <StyledCard>
        <AuthSubTitle>Sign in to your ORY Demo account</AuthSubTitle>
        <Form
          config={config}
          method="password"
          submitLabel="Sign In"
          onSubmit={onSubmit}
        />
      </StyledCard>

      <NavigationCard
        testID="nav-signup"
        description="Need an account?"
        cta="Sign up!"
        onPress={() => navigation.navigate('Registration')}
      />
    </AuthLayout>
  )
}

export default Login
