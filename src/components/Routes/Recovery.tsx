import {
  ContinueWith,
  FrontendApi,
  RecoveryFlow,
  UpdateRecoveryFlowBody,
} from "@ory/client"
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
import { isAxiosError } from "axios"
import { handleFormSubmitError } from "../../helpers/form"

type Props = StackScreenProps<RootStackParamList, "Settings">

function collectRecoveryActions(items?: ContinueWith[]) {
  return items?.reduce(
    (acc, curr) => {
      switch (curr.action) {
        case "show_settings_ui":
          return { ...acc, settingsFlow: curr.flow.id }

        case "set_ory_session_token": {
          return { ...acc, sessionToken: curr.ory_session_token }
        }
      }
      return acc
    },
    { settingsFlow: "", sessionToken: "" },
  )
}

export default function Recovery({ navigation }: Props) {
  const [flow, setFlow] = useState<RecoveryFlow | undefined>(undefined)
  const { setSession, syncSession } = useContext(AuthContext)
  const { sdk } = useContext(ProjectContext)

  async function initializeFlow(): Promise<RecoveryFlow> {
    return await sdk.createNativeRecoveryFlow().then(({ data: flow }) => flow)
  }

  useFocusEffect(
    useCallback(() => {
      initializeFlow().then(setFlow)

      return () => {
        setFlow(undefined)
      }
    }, [sdk]),
  )

  const onSubmit = async (body: UpdateRecoveryFlowBody) => {
    if (!flow) {
      console.error("No flow!")
      return
    }
    try {
      const { data: updatedFlow } = await sdk.updateRecoveryFlow({
        flow: flow?.id,
        updateRecoveryFlowBody: body,
      })
      if (updatedFlow.state === "passed_challenge") {
        const actions = collectRecoveryActions(updatedFlow.continue_with)

        if (actions?.sessionToken) {
          const { data: session } = await sdk.toSession({
            xSessionToken: actions.sessionToken,
          })
          setSession({ session, session_token: actions.sessionToken })
          await syncSession()

          navigation.navigate("Settings", {
            flowId: actions.settingsFlow,
          })
        }
      } else {
        setFlow(updatedFlow)
      }
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        handleFormSubmitError(
          flow,
          setFlow,
          initializeFlow,
          () => {},
          async () => {},
        )(err)
      }
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
        onPress={() => navigation.navigate("Recovery")}
      />

      <ProjectPicker />
    </AuthLayout>
  )
}
