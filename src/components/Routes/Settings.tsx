// This file renders the settings screen.

import {
  SettingsFlow,
  SettingsFlowState,
  UpdateSettingsFlowBody,
} from "@ory/client"
import { useNavigation } from "@react-navigation/native"
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

const CardTitle = styled.View`
  margin-bottom: 15px;
`

const Settings = () => {
  const navigation = useNavigation()
  const { project } = useContext(ProjectContext)
  const { isAuthenticated, sessionToken, setSession, syncSession } =
    useContext(AuthContext)
  const [flow, setFlow] = useState<SettingsFlow | undefined>(undefined)

  const initializeFlow = (sessionToken: string) =>
    newOrySdk(project)
      .createNativeSettingsFlow({ xSessionToken: sessionToken })
      .then(({ data: flow }) => {
        setFlow(flow)
      })
      .catch(console.error)

  useEffect(() => {
    if (sessionToken) {
      initializeFlow(sessionToken)
    }
  }, [project, sessionToken])

  useEffect(() => {
    if (!isAuthenticated) {
      navigation.navigate("Login")
    }
  }, [isAuthenticated])

  if (!flow || !sessionToken) {
    return null
  }

  const onSuccess = (result: SettingsFlow) => {
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
    newOrySdk(project)
      .updateSettingsFlow({
        flow: flow.id,
        xSessionToken: sessionToken,
        updateSettingsFlowBody: payload,
      })
      .then(({ data }: any) => {
        onSuccess(data)
      })
      .catch(
        handleFormSubmitError(
          setFlow,
          () => initializeFlow(sessionToken),
          () => setSession(null),
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
