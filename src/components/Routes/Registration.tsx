// This file renders the registration screen.
import { RegistrationFlow, UpdateRegistrationFlowBody } from "@ory/client"
import { useFocusEffect } from "@react-navigation/native"
import { StackScreenProps } from "@react-navigation/stack"
import React, { useContext, useEffect, useState } from "react"
import { Platform } from "react-native"
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
    React.useCallback(() => {
      initializeFlow()

      return () => {
        setConfig(undefined)
      }
    }, [project]),
  )

  useEffect(() => {
    if (isAuthenticated) {
      navigation.navigate("Home")
    }
  }, [isAuthenticated])

  if (isAuthenticated) {
    return null
  }

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

        // Looks like we got a session!
        return Promise.resolve({
          session: data.session,
          session_token: data.session_token,
        })
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
