// This file renders the registration screen.
import { RegistrationFlow, UpdateRegistrationFlowBody } from "@ory/client"
import { useFocusEffect } from "@react-navigation/native"
import { StackScreenProps } from "@react-navigation/stack"
import React, { useCallback, useContext, useState } from "react"
import { Platform } from "react-native"
import { SessionContext } from "../../helpers/auth"
import { getNodeId, handleFormSubmitError } from "../../helpers/form"
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

type Props = StackScreenProps<RootStackParamList, "Registration">

const Registration = ({ navigation }: Props) => {
  const [flow, setConfig] = useState<RegistrationFlow | undefined>(undefined)
  const { project } = useContext(ProjectContext)
  const { setSession, isAuthenticated } = useContext(AuthContext)

  const initializeFlow = () =>
    newOrySdk(project)
      .createNativeRegistrationFlow()
      // The flow was initialized successfully, let's set the form data:
      .then(({ data: flow }) => {
        setConfig(flow)
      })
      .catch(console.error)

  // When the component is mounted, we initialize a new use login flow:
  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) {
        navigation.navigate("Home")
        return
      }
      initializeFlow()

      return () => {
        setConfig(undefined)
      }
    }, [project]),
  )

  // This will update the registration flow with the user provided input:
  const onSubmit = async (
    payload: UpdateRegistrationFlowBody,
  ): Promise<void> => {
    if (!flow) {
      return
    }

    newOrySdk(project)
      .updateRegistrationFlow({
        flow: flow.id,
        updateRegistrationFlowBody: payload,
      })
      .then(({ data }) => {
        // ORY Kratos can be configured in such a way that it requires a login after
        // registration. You could handle that case by navigating to the Login screen
        // but for simplicity we'll just print an error here:
        if (!data.session_token || !data.session) {
          const err = new Error(
            "It looks like you configured ORY Kratos to not issue a session automatically after registration. This edge-case is currently not supported in this example app. You can find more information on enabling this feature here: https://www.ory.sh/kratos/docs/next/self-service/flows/user-registration#successful-registration",
          )
          return Promise.reject(err)
        }

        const s: SessionContext = {
          session: data.session,
          session_token: data.session_token,
        }

        if (data.continue_with) {
          for (const c of data.continue_with) {
            switch (c.action) {
              case "show_verification_ui": {
                console.log("got a verfification flow, navigating to it", c)
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

        // Looks like we got a session!
        return Promise.resolve(s)
      })
      // Let's log the user in!
      .then(setSession)
      .catch(
        handleFormSubmitError<RegistrationFlow | undefined>(
          setConfig,
          initializeFlow,
        ),
      )
  }

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
        onPress={() => navigation.navigate({ key: "Login" })}
      />

      <ProjectPicker />
    </AuthLayout>
  )
}

export default Registration
