import React, { useEffect, useState } from 'react'
import {
  SelfServiceLoginFlow,
  SelfServiceRegistrationFlow,
  SelfServiceSettingsFlow,
  SubmitSelfServiceLoginFlowBody,
  SubmitSelfServiceRegistrationFlowBody,
  SubmitSelfServiceSettingsFlowBody,
  UiNode
} from '@ory/kratos-client'
import Messages from './Messages'
import { getNodeId, getNodeValue } from '../../../helpers/form'
import { Node, TextInputOverride } from './Node'

interface Props<T> {
  flow?:
    | SelfServiceLoginFlow
    | SelfServiceRegistrationFlow
    | SelfServiceSettingsFlow
  onSubmit: (payload: T) => Promise<void>
  only?: 'password' | 'profile' | 'totp' | 'lookup_secret'
  textInputOverride?: TextInputOverride
}

export const SelfServiceFlow = <
  T extends
    | SubmitSelfServiceSettingsFlowBody
    | SubmitSelfServiceLoginFlowBody
    | SubmitSelfServiceRegistrationFlowBody
>({
  flow,
  only,
  onSubmit,
  textInputOverride
}: Props<T>) => {
  const [inProgress, setInProgress] = useState(false)
  const [values, setValues] = useState<T>({} as T)
  const [nodes, setNodes] = useState<Array<UiNode>>([])

  useEffect(() => {
    if (!flow) {
      return
    }

    const nodes = flow.ui.nodes.filter(({ group }) => {
      if (only) {
        return group === only || group === 'default'
      }
      return true
    })

    const values: Partial<T> = {}
    nodes.forEach((node: UiNode) => {
      const name = getNodeId(node)
      const value = getNodeValue(node)

      const key = name as keyof T
      values[key] = value || ('' as any)
    })

    setValues(values as T)
    setNodes(nodes)
  }, [flow])
  if (!flow) {
    return null
  }

  const onChange = (name: string) => (value: any) => {
    setValues((values) => ({
      ...values,
      [name]: value
    }))
  }

  const getValue = (name: string) => values[name as keyof T]
  const onPress = (method?: string) => {
    setInProgress(true)
    if (method) {
      values['method'] = method
    }
    onSubmit(values).then(() => {
      setInProgress(false)
    })
  }

  return (
    <>
      <Messages testID="form-messages" messages={flow.ui.messages} />
      {nodes.map((node: UiNode, k) => {
        const name = getNodeId(node)
        return (
          <Node
            key={`form-field-${flow.ui.action || ''}-${name}-${k}`}
            textInputOverride={textInputOverride}
            disabled={inProgress}
            value={getValue(name)}
            onChange={onChange(name)}
            node={node}
            isSubmitting={inProgress}
            onSubmitPress={onPress}
          />
        )
      })}
    </>
  )
}
