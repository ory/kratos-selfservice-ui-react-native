// This file renders the settings screen.

import React, { useContext, useEffect, useState } from 'react'
import { showMessage } from 'react-native-flash-message'
import styled from 'styled-components/native'

import { SelfServiceFlow } from '../Ory/Ui'
import { newKratosSdk } from '../../helpers/sdk'
import StyledCard from '../Styled/StyledCard'
import { AuthContext } from '../AuthProvider'
import Layout from '../Layout/Layout'
import StyledText from '../Styled/StyledText'
import { handleFormSubmitError } from '../../helpers/form'
import { ProjectContext } from '../ProjectProvider'
import {
  SelfServiceSettingsFlow,
  SubmitSelfServiceSettingsFlowBody
} from '@ory/kratos-client'
import { SelfServiceSettingsFlowState } from '@ory/kratos-client'

const CardTitle = styled.View`
  margin-bottom: 15px;
`

const Settings = () => {
  const { project } = useContext(ProjectContext)
  const { sessionToken, setSession, syncSession } = useContext(AuthContext)
  const [flow, setFlow] = useState<SelfServiceSettingsFlow | undefined>(
    undefined
  )

  const initializeFlow = () =>
    newKratosSdk(project)
      .initializeSelfServiceSettingsFlowWithoutBrowser(sessionToken)
      .then(({ data: flow }) => {
        setFlow(flow)
      })
      .catch(console.error)

  useEffect(() => {
    initializeFlow()
  }, [project, sessionToken])

  if (!sessionToken) {
    return null
  }

  if (!flow) {
    return null
  }

  const onSuccess = (result: SelfServiceSettingsFlow) => {
    if (result.state === SelfServiceSettingsFlowState.Success) {
      syncSession().then(() => {
        showMessage({
          message: 'Your changes have been saved',
          type: 'success'
        })
      })
    }
    setFlow(result)
  }

  const onSubmit = (payload: SubmitSelfServiceSettingsFlowBody) =>
    newKratosSdk(project)
      .submitSelfServiceSettingsFlow(flow.id, sessionToken, payload)
      .then(({ data }) => onSuccess(data))
      .catch(
        handleFormSubmitError(setFlow, initializeFlow, () => setSession(null))
      )

  return (
    <Layout>
      <StyledCard testID={'settings-password'}>
        <CardTitle>
          <StyledText variant={'h2'}>Change password</StyledText>
        </CardTitle>
        <SelfServiceFlow flow={flow} only="password" onSubmit={onSubmit} />
      </StyledCard>

      <StyledCard testID={'settings-profile'}>
        <CardTitle>
          <StyledText variant={'h2'}>Profile settings</StyledText>
        </CardTitle>
        <SelfServiceFlow flow={flow} only="profile" onSubmit={onSubmit} />
      </StyledCard>

      <StyledCard testID={'settings-totp'}>
        <CardTitle>
          <StyledText variant={'h2'}>2FA authenticator</StyledText>
        </CardTitle>
        <SelfServiceFlow flow={flow} only="totp" onSubmit={onSubmit} />
      </StyledCard>

      <StyledCard testID={'settings-lookup'}>
        <CardTitle>
          <StyledText variant={'h2'}>Backup recovery codes</StyledText>
        </CardTitle>
        <SelfServiceFlow flow={flow} only="lookup_secret" onSubmit={onSubmit} />
      </StyledCard>
    </Layout>
  )
}

export default Settings
