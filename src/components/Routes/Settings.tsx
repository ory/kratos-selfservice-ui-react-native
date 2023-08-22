// This file renders the settings screen.

import {
  FrontendApi,
  SettingsFlow,
  SettingsFlowState,
  UpdateSettingsFlowBody,
} from "@ory/client"
import { useNavigation, useRoute } from "@react-navigation/native"
import React, { useContext, useEffect, useState } from "react"
import { showMessage } from "react-native-flash-message"
import styled from "styled-components/native"
import { handleFormSubmitError } from "../../helpers/form"
import { newOrySdk } from "../../helpers/sdk"
import { AuthContext } from "../AuthProvider"
import Layout from "../Layout/Layout"
import { SelfServiceFlow } from "../Ory/Ui"
import { ProjectContext } from "../ProjectProvider"
import StyledCard from "../Styled/StyledCard"
import StyledText from "../Styled/StyledText"
import { StackScreenProps } from "@react-navigation/stack"
import { RootStackParamList } from "../Navigation"

const CardTitle = styled.View`
  margin-bottom: 15px;
`

async function initializeFlow(sdk: FrontendApi, sessionToken: string) {
  const { data: flow } = await sdk.createNativeSettingsFlow({
    xSessionToken: sessionToken,
  })
  return flow
}

async function fetchFlow(
  sdk: FrontendApi,
  sessionToken: string,
  flowId: string,
) {
  const { data: flow } = await sdk.getSettingsFlow({
    id: flowId,
    xSessionToken: sessionToken,
  })
  return flow
}

type Props = StackScreenProps<RootStackParamList, "Settings">

const Settings = ({ navigation, route }: Props) => {
  const { sdk } = useContext(ProjectContext)
  const { isAuthenticated, sessionToken, setSession, syncSession } =
    useContext(AuthContext)
  const [flow, setFlow] = useState<SettingsFlow | undefined>(undefined)

  useEffect(() => {
    if (!sessionToken || !isAuthenticated) {
      navigation.navigate("Login", {})
      return
    }
    if (route.params.flowId) {
      fetchFlow(sdk, sessionToken, route.params.flowId).then(setFlow)
    } else {
      initializeFlow(sdk, sessionToken).then(setFlow)
    }
  }, [sdk, sessionToken])

  if (!flow || !sessionToken) {
    return null
  }

  const onSuccess = (result: SettingsFlow) => {
    if (result.continue_with) {
      if (result.continue_with) {
        for (const c of result.continue_with) {
          switch (c.action) {
            case "show_verification_ui": {
              console.log("got a verification flow, navigating to it", c)
              navigation.navigate("Verification", {
                flowId: c.flow.id,
              })
              break
            }
          }
        }
      }
    }
    if (result.state === SettingsFlowState.Success) {
      syncSession().then(() => {
        showMessage({
          message: "Your changes have been saved",
          type: "success",
        })
      })
    }
    setFlow(result)
  }

  const onSubmit = (payload: UpdateSettingsFlowBody) =>
    sdk
      .updateSettingsFlow({
        flow: flow.id,
        xSessionToken: sessionToken,
        updateSettingsFlowBody: payload,
      })
      .then(({ data }) => {
        onSuccess(data)
      })
      .catch(
        handleFormSubmitError(
          undefined,
          setFlow,
          () => initializeFlow(sdk, sessionToken).then,
          () => setSession(null),
          async () => {},
        ),
      )

  return (
    <Layout>
      <StyledCard testID={"settings-password"}>
        <CardTitle>
          <StyledText variant={"h2"}>Change password</StyledText>
        </CardTitle>
        <SelfServiceFlow flow={flow} only="password" onSubmit={onSubmit} />
      </StyledCard>

      <StyledCard testID={"settings-profile"}>
        <CardTitle>
          <StyledText variant={"h2"}>Profile settings</StyledText>
        </CardTitle>
        <SelfServiceFlow flow={flow} only="profile" onSubmit={onSubmit} />
      </StyledCard>

      {flow?.ui.nodes.find(({ group }) => group === "totp") ? (
        <StyledCard testID={"settings-totp"}>
          <CardTitle>
            <StyledText variant={"h2"}>2FA authenticator</StyledText>
          </CardTitle>
          <SelfServiceFlow flow={flow} only="totp" onSubmit={onSubmit} />
        </StyledCard>
      ) : null}

      {flow?.ui.nodes.find(({ group }) => group === "lookup_secret") ? (
        <StyledCard testID={"settings-lookup"}>
          <CardTitle>
            <StyledText variant={"h2"}>Backup recovery codes</StyledText>
          </CardTitle>
          <SelfServiceFlow
            flow={flow}
            only="lookup_secret"
            onSubmit={onSubmit}
          />
        </StyledCard>
      ) : null}
    </Layout>
  )
}

export default Settings
