// This file renders the settings screen.

import React, { useContext, useEffect, useState } from 'react'
import { SettingsFlow } from '@oryd/kratos-client'
import { showMessage } from 'react-native-flash-message'

import Form from '../Form/Form'
import { kratosWithSessionToken } from '../../helpers/sdk'
import StyledCard from '../Styled/StyledCard'
import { AuthContext } from '../AuthProvider'
import Layout from '../Layout/Layout'
import StyledText from '../Styled/StyledText'
import styled from 'styled-components/native'
import { CompleteSelfServiceSettingsFlowWithPasswordMethod } from '@oryd/kratos-client/api'
import { handleFormSubmitError } from '../../helpers/form'
import { Button, View } from 'react-native'

const CardTitle = styled.View`
  margin-bottom: 15px;
`

const Settings = () => {
  const { sessionToken, setSession, syncSession } = useContext(AuthContext)
  if (!sessionToken) {
    return null
  }

  const [config, setConfig] = useState<SettingsFlow | undefined>(undefined)

  const kratos = kratosWithSessionToken(sessionToken)
  const initializeFlow = () =>
    kratos
      .initializeSelfServiceSettingsViaAPIFlow()
      .then(({ data: flow }) => {
        setConfig(flow)
      })
      .catch(console.error)

  useEffect(() => {
    initializeFlow()
  }, [])

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

  const onSubmitPassword = (
    payload: CompleteSelfServiceSettingsFlowWithPasswordMethod
  ) =>
    kratos
      .completeSelfServiceSettingsFlowWithPasswordMethod(config.id, payload)
      .then(onSuccess)
      .catch(
        handleFormSubmitError(setConfig, initializeFlow, () => setSession(null))
      )

  const onSubmitProfile = (payload: object) =>
    kratos
      .completeSelfServiceSettingsFlowWithProfileMethod(config.id, payload)
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
          config={config}
          method="password"
          submitLabel="Update password"
          onSubmit={onSubmitPassword}
        />
      </StyledCard>
      <StyledCard testID={'settings-profile'}>
        <CardTitle>
          <StyledText variant={'h2'}>Profile settings</StyledText>
        </CardTitle>
        <Form
          config={config}
          method="profile"
          submitLabel="Update profile"
          onSubmit={onSubmitProfile}
        />
      </StyledCard>
    </Layout>
  )
}

export default Settings
