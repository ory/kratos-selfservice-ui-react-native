// This file renders the settings screen.

import React, { useContext, useEffect, useState } from 'react'
import { showMessage } from 'react-native-flash-message'
import styled from 'styled-components/native'
import { SettingsFlow } from '@ory/kratos-client'
import { CompleteSelfServiceSettingsFlowWithPasswordMethod } from '@ory/kratos-client/api'

import Form from '../Form/Form'
import { newKratosSdk } from '../../helpers/sdk'
import StyledCard from '../Styled/StyledCard'
import { AuthContext } from '../AuthProvider'
import Layout from '../Layout/Layout'
import StyledText from '../Styled/StyledText'
import { handleFormSubmitError } from '../../helpers/form'
import ProjectForm from '../Form/Project'
import { ProjectContext } from '../ProjectProvider'

const CardTitle = styled.View`
  margin-bottom: 15px;
`

const Settings = () => {
  const { project } = useContext(ProjectContext)
  const { sessionToken, setSession, syncSession } = useContext(AuthContext)
  const [config, setConfig] = useState<SettingsFlow | undefined>(undefined)

  const initializeFlow = () =>
    newKratosSdk(project, sessionToken)
      .initializeSelfServiceSettingsViaAPIFlow()
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

  const onSubmitPassword = (
    payload: CompleteSelfServiceSettingsFlowWithPasswordMethod
  ) =>
    newKratosSdk(project, sessionToken)
      .completeSelfServiceSettingsFlowWithPasswordMethod(config.id, payload)
      .then(onSuccess)
      .catch(
        handleFormSubmitError(setConfig, initializeFlow, () => setSession(null))
      )

  const onSubmitProfile = (payload: object) =>
    newKratosSdk(project, sessionToken)
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
