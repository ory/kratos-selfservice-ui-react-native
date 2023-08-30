import { UpdateVerificationFlowBody, VerificationFlow } from "@ory/client"
import { useFocusEffect } from "@react-navigation/native"
import { StackScreenProps } from "@react-navigation/stack"
import React, { useCallback, useContext, useState } from "react"
import { getNodeId, handleFormSubmitError } from "../../helpers/form"
import AuthLayout from "../Layout/AuthLayout"
import ProjectPicker from "../Layout/ProjectPicker"
import { RootStackParamList } from "../Navigation"
import { SelfServiceFlow } from "../Ory/Ui"
import { ProjectContext } from "../ProjectProvider"
import AuthSubTitle from "../Styled/AuthSubTitle"
import NavigationCard from "../Styled/NavigationCard"
import StyledButton from "../Styled/StyledButton"
import StyledCard from "../Styled/StyledCard"
import { logSDKError } from "../../helpers/axios"

type Props = StackScreenProps<RootStackParamList, "Verification">

export default function Verification({ navigation, route }: Props) {
  const [flow, setFlow] = useState<VerificationFlow | undefined>(undefined)
  const { sdk } = useContext(ProjectContext)

  const initializeFlow = () =>
    sdk
      .createNativeVerificationFlow()
      // The flow was initialized successfully, let's set the form data:
      .then(({ data: flow }) => {
        setFlow(flow)
      })
      .catch(logSDKError)

  const fetchFlow = (id: string) =>
    sdk
      .getVerificationFlow({ id })
      .then(({ data }) => {
        setFlow(data)
      })
      .catch(console.error)

  // When the component is mounted, we initialize a new verification flow
  // or use the id provided by the route params to fetch that flow:
  useFocusEffect(
    useCallback(() => {
      if (route.params.flowId) {
        fetchFlow(route.params.flowId)
      } else {
        initializeFlow()
      }

      return () => {
        setFlow(undefined)
      }
    }, [sdk, route.params.flowId]),
  )

  // This will update the verification flow with the user provided input:
  const onSubmit = async (
    payload: UpdateVerificationFlowBody,
  ): Promise<void> => {
    if (!flow) {
      return
    }

    sdk
      .updateVerificationFlow({
        flow: flow.id,
        updateVerificationFlowBody: payload,
      })
      .then(({ data }) => {
        setFlow(data)
      })
      .catch(
        handleFormSubmitError<VerificationFlow | undefined>(
          flow,
          setFlow,
          initializeFlow,
          () => {},
          async () => {},
        ),
      )
  }

  return (
    <AuthLayout>
      <StyledCard>
        <AuthSubTitle>Verify your account</AuthSubTitle>
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
            }
            return props
          }}
          flow={flow}
          onSubmit={onSubmit}
        />
        {flow?.state === "passed_challenge" && (
          <StyledButton
            testID="continue-button"
            onPress={() => navigation.navigate("Home")}
            title="Continue"
          />
        )}
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
