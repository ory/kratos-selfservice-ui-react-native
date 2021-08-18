// This file renders the settings screen.

import React, { useContext, useEffect, useState } from 'react'
import { showMessage } from 'react-native-flash-message'
import styled from 'styled-components/native'

import Form from '../Form/Form'
import { newKratosSdk } from '../../helpers/sdk'
import StyledCard from '../Styled/StyledCard'
import { AuthContext } from '../AuthProvider'
import Layout from '../Layout/Layout'
import StyledText from '../Styled/StyledText'
import { handleFormSubmitError } from '../../helpers/form'
import { ProjectContext } from '../ProjectProvider'
import { SelfServiceSettingsFlow, SubmitSelfServiceSettingsFlowBody } from '@ory/kratos-client';

const CardTitle = styled.View`
  margin-bottom: 15px;
`

const Settings = () => {
  const { project } = useContext(ProjectContext)
  const { sessionToken, setSession, syncSession } = useContext(AuthContext)
  const [config, setConfig] = useState<SelfServiceSettingsFlow | undefined>(undefined)

  const initializeFlow = () =>
    newKratosSdk(project)
      .initializeSelfServiceSettingsFlowWithoutBrowser(sessionToken)
      .then(({ data: flow }) => {
        setConfig(flow)
      })
      .catch(console.error)

  useEffect(() => {
    initializeFlow()
  }, [project, sessionToken])

  if (!sessionToken) {
    return null
  }

  if (!config) {
    return null
  }

  const onSuccess = () =>
    syncSession().then(() => {
      showMessage({
        message: 'Your changes have been saved',
        type: 'success'
      })
    })

  const onSubmit = (payload: SubmitSelfServiceSettingsFlowBody) =>
    newKratosSdk(project)
      .submitSelfServiceSettingsFlow(config.id, sessionToken, payload)
      .then(onSuccess)
      .catch(
        handleFormSubmitError(setConfig, initializeFlow, () => setSession(null))
      )

  return (
    <Layout>
      <StyledCard testID={'settings-password'}>
        <CardTitle>
          <StyledText variant={'h2'}>Change password</StyledText>
        </CardTitle>
        <Form
          flow={config}
          only="password"
          submitLabel="Update password"
          onSubmit={onSubmit}
        />
      </StyledCard>

      <StyledCard testID={'settings-profile'}>
        <CardTitle>
          <StyledText variant={'h2'}>Profile settings</StyledText>
        </CardTitle>
        <Form
          flow={config}
          only="profile"
          submitLabel="Update profile"
          onSubmit={onSubmit}
        />
      </StyledCard>

      <StyledCard testID={'settings-totp'}>
        <CardTitle>
          <StyledText variant={'h2'}>2FA authenticator</StyledText>
        </CardTitle>
        <Form
          flow={config}
          only="totp"
          submitLabel="Update"
          onSubmit={onSubmit}
        />
      </StyledCard>

      <StyledCard testID={'settings-lookup'}>
        <CardTitle>
          <StyledText variant={'h2'}>Backup recovery codes</StyledText>
        </CardTitle>
        <Form
          flow={config}
          only="lookup_secret"
          submitLabel="Update"
          onSubmit={onSubmit}
        />
      </StyledCard>
    </Layout>
  )
}

export default Settings
