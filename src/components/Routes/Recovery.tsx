// This file renders the recovery screen.
import {
  SelfServiceBrowserLocationChangeRequiredError,
  SelfServiceFlowName,
  SelfServiceRecoveryFlow,
  SubmitSelfServiceRecoveryFlowBody
} from '@ory/client'
import { useFocusEffect } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { useContext, useState } from 'react'
import { handleFormSubmitError } from '../../helpers/form'
import { newKratosSdk } from '../../helpers/sdk'
import { AuthContext } from '../AuthProvider'
import AuthLayout from '../Layout/AuthLayout'
import { RootStackParamList } from '../Navigation'
import { SelfServiceFlow } from '../Ory/Ui'
import { ProjectContext } from '../ProjectProvider'
import AuthSubTitle from '../Styled/AuthSubTitle'
import StyledCard from '../Styled/StyledCard'

type Props = StackScreenProps<RootStackParamList, 'Recovery'>

const Recovery = ({ navigation }: Props) => {
  const [flow, setFlow] = useState<SelfServiceRecoveryFlow | undefined>(
    undefined
  )
  const { project } = useContext(ProjectContext)
  const { setSession } = useContext(AuthContext)

  const initializeFlow = () =>
    newKratosSdk(project)
      .initializeSelfServiceRecoveryFlowWithoutBrowser()
      .then((response) => {
        const { data: flow } = response
        // The flow was initialized successfully, let's set the form data:
        setFlow(flow)
      })
      .catch(console.error)

  // When the component is mounted, we initialize a new recovery flow:
  useFocusEffect(
    React.useCallback(() => {
      initializeFlow()

      return () => {
        setFlow(undefined)
      }
    }, [project])
  )

  const handleRedirection = async (
    err: SelfServiceBrowserLocationChangeRequiredError
  ) => {
    // A SelfServiceBrowserLocationChangeRequiredError indicates the `success` of the recovery api flow
    // as after a recovery the user _needs_ to update their password in a settings flow
    if (
      err.session_token &&
      err.redirect_flow_name === SelfServiceFlowName.Settings
    ) {
      const { data: session } = await newKratosSdk(project).toSession(
        err.session_token,
        undefined
      )
      setSession({ session, session_token: err.session_token })

      setTimeout(() => {
        if (err.redirect_flow_id) {
          navigation.navigate('Settings', {
            flowId: err.redirect_flow_id
          })
        }
      }, 100)
    }
  }

  const onSubmit = async (payload: SubmitSelfServiceRecoveryFlowBody) => {
    if (flow) {
      try {
        const { data: recoveryFlow } = await newKratosSdk(
          project
        ).submitSelfServiceRecoveryFlow(flow.id, payload)
        setFlow(recoveryFlow)
      } catch (err: any) {
        handleFormSubmitError(
          setFlow,
          () => initializeFlow(),
          () => {},
          (err) => handleRedirection(err).then(() => {})
        )(err)
      }
    }
  }

  return (
    <AuthLayout>
      <StyledCard>
        <AuthSubTitle>Recovery your account</AuthSubTitle>
        <SelfServiceFlow flow={flow} onSubmit={onSubmit} />
      </StyledCard>
    </AuthLayout>
  )
}

export default Recovery
