// This file renders the login screen.
import {
  SelfServiceLoginFlow,
  SubmitSelfServiceLoginFlowBody
} from '@ory/client'
import { useFocusEffect } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { useContext, useState } from 'react'

import { SessionContext } from '../../helpers/auth'
import { handleFormSubmitError } from '../../helpers/form'
import { newKratosSdk } from '../../helpers/sdk'
import { AuthContext } from '../AuthProvider'
import AuthLayout from '../Layout/AuthLayout'
import ProjectPicker from '../Layout/ProjectPicker'
import { RootStackParamList } from '../Navigation'
import { SelfServiceFlow } from '../Ory/Ui'
import { ProjectContext } from '../ProjectProvider'
import AuthSubTitle from '../Styled/AuthSubTitle'
import NavigationCard from '../Styled/NavigationCard'
import StyledCard from '../Styled/StyledCard'

type Props = StackScreenProps<RootStackParamList, 'Login'>

const Login = ({ navigation, route }: Props) => {
  const { project } = useContext(ProjectContext)
  const { setSession, session, sessionToken } = useContext(AuthContext)
  const [flow, setFlow] = useState<SelfServiceLoginFlow | undefined>(undefined)

  const initializeFlow = () =>
    newKratosSdk(project)
      .initializeSelfServiceLoginFlowWithoutBrowser(
        route.params.refresh,
        route.params.aal,
        sessionToken
      )
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
  const onSubmit = (payload: SubmitSelfServiceLoginFlowBody) =>
    flow
      ? newKratosSdk(project)
          .submitSelfServiceLoginFlow(flow.id, payload, sessionToken)
          .then(({ data }) => Promise.resolve(data as SessionContext))
          // Looks like everything worked and we have a session!
          .then((session) => {
            setSession(session)
            setTimeout(() => {
              navigation.navigate('Home')
            }, 100)
          })
          .catch(handleFormSubmitError(setFlow, initializeFlow))
      : Promise.resolve()

  return (
    <AuthLayout>
      <StyledCard>
        <AuthSubTitle>Sign in to your account</AuthSubTitle>
        <SelfServiceFlow flow={flow} onSubmit={onSubmit} />
      </StyledCard>

      <NavigationCard
        testID="nav-signup"
        description="Need an account?"
        cta="Sign up!"
        onPress={() => navigation.navigate('Registration')}
      />
      <NavigationCard
        testID="nav-recover"
        description="Recover your account"
        cta="Sign up!"
        onPress={() => navigation.navigate('Recovery')}
      />

      <ProjectPicker />
    </AuthLayout>
  )
}

export default Login
