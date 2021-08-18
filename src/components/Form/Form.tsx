import React, { useState } from 'react'
import {
  SelfServiceLoginFlow,
  SelfServiceRegistrationFlow,
  SelfServiceSettingsFlow,
  SubmitSelfServiceLoginFlowBody, SubmitSelfServiceRegistrationFlowBody,
  SubmitSelfServiceSettingsFlowBody,
  UiNode,
} from '@ory/kratos-client';
import Button from '../Styled/StyledButton'
import Messages from './Messages'
import { getNodeName, getNodeValue } from '../../helpers/form'
import Field from './Field'
import { TextInputProps } from 'react-native'

interface Props<T> {
  flow?: SelfServiceLoginFlow | SelfServiceRegistrationFlow | SelfServiceSettingsFlow
  onSubmit: (payload: T) => Promise<void>
  submitLabel: string
  only?: 'password' | 'profile' | 'totp' | 'lookup_secret'
  fieldTypeOverride?: (node: UiNode, props: TextInputProps) => TextInputProps
}

const Form = <
  T extends
    | SubmitSelfServiceSettingsFlowBody
    | SubmitSelfServiceLoginFlowBody
    | SubmitSelfServiceRegistrationFlowBody
>({
  flow,
  only,
  onSubmit,
  submitLabel,
  fieldTypeOverride
}: Props<T>) => {
  if (!flow) {
    return null
  }

  const nodes = flow.ui.nodes.filter(({ group }) => {
    if (only) {
      return group === only || group === 'default'
    }
    return true
  })

  const initialState: Partial<T> = {}
  nodes.forEach((node: UiNode) => {
    const name = getNodeName(node)
    const value = getNodeValue(node)

    const key = name as keyof T
    initialState[key] = value || ('' as any)
  })

  const [values, setValues] = useState<T>(initialState as T)
  const [inProgress, setInProgress] = useState(false)

  const onChange = (name: string) => (value: any) => {
    setValues((values) => ({
      ...values,
      [name]: value
    }))
  }

  const getValue = (name: string) => values[name as keyof T]
  const onPress = () => {
    setInProgress(true)
    onSubmit(values).then(() => {
      setInProgress(false)
    })
  }

  return (
    <>
      <Messages testID="form-messages" messages={flow.ui.messages} />
      {nodes.map((node: UiNode, k) => {
        const name = getNodeName(node)
        return (
          <Field
            key={`form-field-${flow.ui.action || ''}-${name}-${k}`}
            fieldTypeOverride={fieldTypeOverride}
            disabled={inProgress}
            value={getValue(name)}
            onChange={onChange(name)}
            node={node}
          />
        )
      })}

      <Button
        testID="submit-form"
        disabled={inProgress}
        title={submitLabel}
        onPress={onPress}
      />
    </>
  )
}

export default Form
