// This file renders the login screen.
import React, { useContext, useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { useFocusEffect } from '@react-navigation/native'
import { LoginFlow } from '@ory/kratos-client'
import { CompleteSelfServiceLoginFlowWithPasswordMethod } from '@ory/kratos-client/api'

import Form from '../Form/Form'
import { newKratosSdk } from '../../helpers/sdk'
import StyledCard from '../Styled/StyledCard'
import AuthLayout from '../Layout/AuthLayout'
import NavigationCard from '../Styled/NavigationCard'
import AuthSubTitle from '../Styled/AuthSubTitle'
import { RootStackParamList } from '../Navigation'
import { AuthContext } from '../AuthProvider'
import { handleFormSubmitError } from '../../helpers/form'
import ProjectForm from '../Form/Project'
import { ProjectContext } from '../ProjectProvider'

type Props = StackScreenProps<RootStackParamList, 'Login'>

const Login = ({ navigation }: Props) => {
  const { project, setProject } = useContext(ProjectContext)
  const { setSession } = useContext(AuthContext)
  const [config, setConfig] = useState<LoginFlow | undefined>(undefined)

  const initializeFlow = () =>
    newKratosSdk(project)
      .initializeSelfServiceLoginViaAPIFlow()
      .then(({ data: flow }) => {
        // The flow was initialized successfully, let's set the form data:
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

  // This will update the login flow with the user provided input:
  const onSubmit = (payload: CompleteSelfServiceLoginFlowWithPasswordMethod) =>
    config
      ? newKratosSdk(project)
          .completeSelfServiceLoginFlowWithPasswordMethod(config.id, payload)
          .then(({ data }) => Promise.resolve(data))
          // Looks like everything worked and we have a session!
          .then(setSession)
          .catch(handleFormSubmitError(setConfig, initializeFlow))
      : Promise.resolve()

  return (
    <AuthLayout>
      <StyledCard>
        <AuthSubTitle>Sign in to your account</AuthSubTitle>
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

      <ProjectForm />
    </AuthLayout>
  )
}

export default Login
