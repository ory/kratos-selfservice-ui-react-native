// This file renders the registration screen.
import {
  RegistrationFlow,
  SuccessfulNativeRegistration,
  UpdateRegistrationFlowBody,
} from "@ory/client"
import { useFocusEffect } from "@react-navigation/native"
import { StackScreenProps } from "@react-navigation/stack"
import axios, { AxiosResponse } from "axios"
import React, { useCallback, useContext, useState } from "react"
import { Platform } from "react-native"
import { SessionContext } from "../../helpers/auth"
import { getNodeId, handleFormSubmitError } from "../../helpers/form"
import { registerWithApple } from "../../helpers/oidc/apple"
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
import { logSDKError } from "../../helpers/axios"

type Props = StackScreenProps<RootStackParamList, "Registration">

const Registration = ({ navigation }: Props) => {
  const [flow, setFlow] = useState<RegistrationFlow | undefined>(undefined)
  const { sdk } = useContext(ProjectContext)
  const { setSession, isAuthenticated } = useContext(AuthContext)

  const initializeFlow = () =>
    sdk
      .createNativeRegistrationFlow({
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
      // The flow was initialized successfully, let's set the form data:
      .then(({ data: flow }) => {
        setFlow(flow)
        console.log("Setting registration flow", JSON.stringify(flow))
      })
      .catch(logSDKError)

  // When the component is mounted, we initialize a new use login flow:
  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) {
        navigation.navigate("Home")
        return
      }
      initializeFlow()

      return () => setFlow(undefined)
    }, [sdk]),
  )

  const refetchFlow = () =>
    sdk
      .getRegistrationFlow({ id: flow!.id })
      .then(({ data: f }) => setFlow({ ...flow, ...f })) // merging ensures we don't lose the code
      .catch(logSDKError)

  const setSessionAndRedirect = (session: SessionContext) => {
    setSession(session)
    setTimeout(() => {
      navigation.navigate("Home")
    }, 100)
  }

  // This will update the registration flow with the user provided input:
  const onSubmit = async (
    payload: UpdateRegistrationFlowBody,
  ): Promise<void> => {
    if (!flow) {
      return
    }

    console.log("Submitting registration form", payload)
    let res: AxiosResponse<SuccessfulNativeRegistration>
    try {
      if (
        Platform.OS === "ios" &&
        "provider" in payload &&
        payload.provider === "apple"
      ) {
        res = await registerWithApple(sdk, flow.id)
      } else {
        res = await sdk.updateRegistrationFlow({
          flow: flow.id,
          updateRegistrationFlowBody: payload,
        })
      }
    } catch (e) {
      if (!axios.isAxiosError(e)) {
        throw e
      }
      handleFormSubmitError(
        flow,
        setFlow,
        initializeFlow,
        setSessionAndRedirect,
        refetchFlow,
      )(e)
      return
    }

    const { data } = res

    console.log(data)
    // Ory Kratos can be configured in such a way that it requires a login after
    // registration. You could handle that case by navigating to the Login screen
    // but for simplicity we'll just print an error here:
    if (!data.session_token || !data.session) {
      console.error(
        "It looks like you configured Ory Identities to not issue a session automatically after registration. This edge-case is currently not supported in this example app. You can find more information on enabling this feature here: https://www.ory.sh/kratos/docs/next/self-service/flows/user-registration#successful-registration",
      )
      return
    }

    const s: SessionContext = {
      session: data.session,
      session_token: data.session_token,
    }

    let verificationFlow = false
    if (data.continue_with) {
      for (const c of data.continue_with) {
        switch (c.action) {
          case "show_verification_ui": {
            console.log("got a verfication flow, navigating to it", c)
            verificationFlow = true
            navigation.navigate("Verification", {
              flowId: c.flow.id,
            })
            break
          }
          case "set_ory_session_token": {
            // Right now, this is redundant, and is just supposed to show that the session token is also included
            // in the continue_with elements.
            console.log(
              "found an ory session token, storing it for further use",
            )
            s.session_token = c.ory_session_token
            break
          }
        }
      }
    }

    // Let's log the user in!
    setSession(s)
    if (!verificationFlow) {
      navigation.navigate("Home")
    }
  }

  if (!flow) {
    // TODO: Show loading indicator?
    return null
  }

  return (
    <RegistrationUI navigation={navigation} flow={flow} onSubmit={onSubmit} />
  )
}

type RegistrationUIProps = {
  flow: RegistrationFlow
  onSubmit: (payload: UpdateRegistrationFlowBody) => Promise<void>
  navigation: Props["navigation"]
}

function RegistrationUI({ flow, onSubmit, navigation }: RegistrationUIProps) {
  return (
    <AuthLayout>
      <StyledCard>
        <AuthSubTitle>Create an account</AuthSubTitle>
        <SelfServiceFlow
          textInputOverride={(field, props) => {
            switch (getNodeId(field)) {
              case "traits.email":
                return {
                  autoCapitalize: "none",
                  autoCompleteType: "email",
                  textContentType: "username",
                  autoCorrect: false,
                }
              case "password":
                const iOS12Plus =
                  Platform.OS === "ios" &&
                  parseInt(String(Platform.Version), 10) >= 12
                return {
                  textContentType: iOS12Plus ? "newPassword" : "password",
                  secureTextEntry: true,
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
        onPress={() => navigation.navigate("Login", {})}
      />

      <ProjectPicker />
    </AuthLayout>
  )
}
export default Registration
