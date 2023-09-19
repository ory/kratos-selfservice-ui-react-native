// This file renders the login screen.
import { LoginFlow, UpdateLoginFlowBody } from "@ory/client"
import { useFocusEffect } from "@react-navigation/native"
import { StackScreenProps } from "@react-navigation/stack"
import React, { useContext, useState } from "react"

import { SessionContext } from "../../helpers/auth"
import { logSDKError } from "../../helpers/axios"
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
import * as AuthSession from "expo-auth-session"

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
        // If you do use social sign in, please add the following URLs to your allowed return to URLs.
        //   If you the app is running on an emulator or physical device: exp://localhost:8081
        //   If you are using the web version: http://localhost:19006 (or whatever port you are using)
        //   If that does not work, please see the documentation of makeRedirectURI for more information: https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
        // If you don't use Social sign in, you can comment out the following line.
        returnTo: AuthSession.makeRedirectUri({
          preferLocalhost: true,
          path: "/Callback",
        }),
        returnSessionTokenExchangeCode: true,
      })
      .then(({ data: f }) => setFlow(f))
      .catch(logSDKError)

  const refetchFlow = () =>
    newOrySdk(project)
      .getLoginFlow({ id: flow!.id })
      .then(({ data: f }) => setFlow({ ...flow, ...f })) // merging ensures we don't lose the code
      .catch(logSDKError)

  // When the component is mounted, we initialize a new use login flow:
  useFocusEffect(
    React.useCallback(() => {
      initializeFlow()

      return () => {
        setFlow(undefined)
      }
    }, [project]),
  )

  const setSessionAndRedirect = (session: SessionContext) => {
    setSession(session)
    setTimeout(() => {
      navigation.navigate("Home")
    }, 100)
  }

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
          .then(setSessionAndRedirect)
          .catch(
            handleFormSubmitError(
              flow,
              setFlow,
              initializeFlow,
              setSessionAndRedirect,
              refetchFlow,
            ),
          )
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
      <NavigationCard
        testID="nav-recover"
        description="Forgot your password?"
        cta="Reset it!"
        onPress={() => navigation.navigate("Recovery")}
      />

      <ProjectPicker />
    </AuthLayout>
  )
}

export default Login
