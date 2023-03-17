// This file renders the login screen.
import { LoginFlow, UpdateLoginFlowBody } from "@ory/client"
import { useFocusEffect } from "@react-navigation/native"
import { StackScreenProps } from "@react-navigation/stack"
import React, { useContext, useState } from "react"

import { SessionContext } from "../../helpers/auth"
import { handleFormSubmitError } from "../../helpers/form"
import { newOrySdk } from "../../helpers/sdk"
import { AuthContext } from "../AuthProvider"
import AuthLayout from "../Layout/AuthLayout"
import ProjectPicker from "../Layout/ProjectPicker"
import { RootStackParamList } from "../Navigation"
import { SelfServiceFlow } from "../Ory/Ui"
import { ProjectContext } from "../ProjectProvider"
import AuthSubTitle from "../Styled/AuthSubTitle"
import NavigationCard from "../Styled/NavigationCard"
import StyledCard from "../Styled/StyledCard"

type Props = StackScreenProps<RootStackParamList, "Login">

const Login = ({ navigation, route }: Props) => {
  const { project } = useContext(ProjectContext)
  const { setSession, sessionToken } = useContext(AuthContext)
  const [flow, setFlow] = useState<LoginFlow | undefined>(undefined)

  const initializeFlow = () =>
    newOrySdk(project)
      .createNativeLoginFlow({
        aal: route.params.aal,
        refresh: route.params.refresh,
        xSessionToken: sessionToken,
      })
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
    }, [project]),
  )

  // This will update the login flow with the user provided input:
  const onSubmit = (payload: UpdateLoginFlowBody) =>
    flow
      ? newOrySdk(project)
          .updateLoginFlow({
            flow: flow.id,
            updateLoginFlowBody: payload,
            xSessionToken: sessionToken,
          })
          .then(({ data }) => Promise.resolve(data as SessionContext))
          // Looks like everything worked and we have a session!
          .then((session) => {
            setSession(session)
            setTimeout(() => {
              navigation.navigate("Home")
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
        onPress={() => navigation.navigate("Registration")}
      />

      <ProjectPicker />
    </AuthLayout>
  )
}

export default Login
