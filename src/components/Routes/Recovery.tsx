import { ContinueWith, RecoveryFlow, UpdateRecoveryFlowBody } from "@ory/client-fetch"
import { useFocusEffect } from "@react-navigation/native"
import { StackScreenProps } from "@react-navigation/stack"
import React, { useCallback, useContext, useState } from "react"
import AuthLayout from "../Layout/AuthLayout"
import ProjectPicker from "../Layout/ProjectPicker"
import { RootStackParamList } from "../Navigation"
import { SelfServiceFlow } from "../Ory/Ui"
import { ProjectContext } from "../ProjectProvider"
import AuthSubTitle from "../Styled/AuthSubTitle"
import StyledCard from "../Styled/StyledCard"
import { AuthContext } from "../AuthProvider"
import NavigationCard from "../Styled/NavigationCard"
import { handleFormSubmitError } from "../../helpers/form"
import { logSDKError } from "../../helpers/errors"

type Props = StackScreenProps<RootStackParamList, "Recovery">

function collectRecoveryActions(items?: ContinueWith[]) {
  return items?.reduce(
    (acc, curr) => {
      switch (curr.action) {
        case "show_settings_ui":
          return { ...acc, settingsFlowId: curr.flow.id }

        case "set_ory_session_token": {
          return { ...acc, sessionToken: curr.ory_session_token }
        }

        case "show_recovery_ui": {
          return { ...acc, recoveryFlowId: curr.flow.id }
        }
      }
      return acc
    },
    { settingsFlowId: "", sessionToken: "", recoveryFlowId: "" },
  )
}

export default function Recovery({ navigation }: Props) {
  const [flow, setFlow] = useState<RecoveryFlow | undefined>(undefined)
  const { setSession, syncSession } = useContext(AuthContext)
  const { sdk } = useContext(ProjectContext)

  async function initializeFlow(): Promise<void> {
    await sdk
      .createNativeRecoveryFlow()
      .then(setFlow)
      .catch(logSDKError)
  }

  useFocusEffect(
    useCallback(() => {
      initializeFlow()

      return () => {
        setFlow(undefined)
      }
    }, [sdk]),
  )

  const handleContinueWith = async (c: ContinueWith[]): Promise<void> => {
    const actions = collectRecoveryActions(c)

    if (actions?.recoveryFlowId) {
      const flow = await sdk.getRecoveryFlow({
        id: actions.recoveryFlowId,
      })
      setFlow(flow)
    }
  }

  const onSubmit = async (body: UpdateRecoveryFlowBody) => {
    if (!flow) {
      console.error("No flow!")
      return
    }
    try {
      const updatedFlow = await sdk.updateRecoveryFlow({
        flow: flow?.id,
        updateRecoveryFlowBody: body,
      })
      if (updatedFlow.state === "passed_challenge") {
        const actions = collectRecoveryActions(updatedFlow.continue_with)

        if (actions?.sessionToken) {
          const session = await sdk.toSession({
            xSessionToken: actions.sessionToken,
          })
          setSession({ session, session_token: actions.sessionToken })
          await syncSession()

          navigation.navigate("Settings", {
            flowId: actions.settingsFlowId,
          })
        }
      } else {
        setFlow(updatedFlow)
      }
    } catch (err: unknown) {
      await handleFormSubmitError(
        flow,
        setFlow,
        initializeFlow,
        () => {},
        async () => {},
        () => {},
        handleContinueWith,
      )(err)
    }
  }

  return (
    <AuthLayout>
      <StyledCard>
        <AuthSubTitle>Recover access to your account</AuthSubTitle>
        <SelfServiceFlow flow={flow} onSubmit={onSubmit} />
      </StyledCard>

      <NavigationCard
        testID="nav-login"
        description="Remember your password?"
        cta="Login!"
        onPress={() => navigation.navigate("Login", {})}
      />

      <ProjectPicker />
    </AuthLayout>
  )
}
