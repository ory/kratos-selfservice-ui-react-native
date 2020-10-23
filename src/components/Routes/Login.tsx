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
        setConfig(flow)
      })
      .catch(console.error)

  // Initializes the login flow.
  useEffect(() => {
    initializeFlow()
  }, [])

  if (!config) {
    return null
  }

  const onSubmit = (payload: CompleteSelfServiceLoginFlowWithPasswordMethod) =>
    kratos
      .completeSelfServiceLoginFlowWithPasswordMethod(config.id, payload)
      .then(({ data }) => Promise.resolve(data))
      .then(setSession)
      .catch(handleFormSubmitError(setConfig, initializeFlow))

  return (
    <AuthLayout>
      <StyledCard>
        <AuthSubTitle>Sign in to your LoginApp account</AuthSubTitle>

        <Form
          config={config}
          method="password"
          submitLabel="Sign in"
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
