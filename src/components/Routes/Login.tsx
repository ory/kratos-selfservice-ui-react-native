// This file renders the login screen.
import React, { useContext, useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { useFocusEffect } from '@react-navigation/native'
import {
  LoginFlow,
  SubmitSelfServiceLoginFlow,
  SubmitSelfServiceLoginFlowWithPasswordMethod
} from '@ory/kratos-client'

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
  const { project } = useContext(ProjectContext)
  const { setSession } = useContext(AuthContext)
  const [flow, setFlow] = useState<LoginFlow | undefined>(undefined)

  const initializeFlow = () =>
    newKratosSdk(project)
      .initializeSelfServiceLoginViaAPIFlow()
      .then((response) => {
        const { data: flow } = response
        // The flow was initialized successfully, let's set the form data:
        setFlow(flow)
      })
      .catch(console.error)

  // When the component is mounted, we initialize a new use login flow:
  useFocusEffect(
    React.useCallback(() => {
      initializeFlow()

      return () => {
        setFlow(undefined)
      }
    }, [project])
  )

  // This will update the login flow with the user provided input:
  const onSubmit = (payload: SubmitSelfServiceLoginFlow) =>
    flow
      ? newKratosSdk(project)
          .submitSelfServiceLoginFlow(flow.id, payload)
          .then(({ data }) => Promise.resolve(data))
          // Looks like everything worked and we have a session!
          .then(setSession)
          .catch(handleFormSubmitError(setFlow, initializeFlow))
      : Promise.resolve()

  return (
    <AuthLayout>
      <StyledCard>
        <AuthSubTitle>Sign in to your account</AuthSubTitle>
        <Form flow={flow} submitLabel="Sign In" onSubmit={onSubmit} />
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
