import React, { useState } from 'react'
import {
  FormField,
  LoginFlow,
  RegistrationFlow,
  SettingsFlow
} from '@oryd/kratos-client'
import Button from '../Styled/StyledButton'
import Messages from './Messages'
import { camelize, methodConfig } from '../../helpers/form'
import Field from './Field'
import {
  CompleteSelfServiceLoginFlowWithPasswordMethod,
  CompleteSelfServiceSettingsFlowWithPasswordMethod
} from '@oryd/kratos-client/api'
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  View
} from 'react-native'

interface Props<T> {
  config: LoginFlow | RegistrationFlow | SettingsFlow
  method: 'password' | 'profile' | 'link'
  onSubmit: (payload: T) => Promise<void>
  submitLabel: string
}

const Form = <
  T extends
    | object
    | CompleteSelfServiceSettingsFlowWithPasswordMethod
    | CompleteSelfServiceLoginFlowWithPasswordMethod
>({
  config,
  onSubmit,
  submitLabel,
  method
}: Props<T>) => {
  // The Form component keeps track of all the field values in the form.
  // To do so, we initialize
  const inner = methodConfig(config, method)

  if (!inner) {
    return null
  }

  const initialState: Partial<T> = {}
  inner.fields.forEach((field: FormField) => {
    const key = field.name as keyof T
    initialState[key] = (field.value || '') as any // value can be string, number, ... - any is ok here!
  })

  const [values, setValues] = useState<T>(initialState as T)
  const [inProgress, setInProgress] = useState(false)

  const onChange = (name: string) => (value: any) => {
    setValues((values) => ({
      ...values,
      [name]: value
    }))
  }

  const getValue = (name: string) => values[camelize<T>(name)]
  const onPress = () => {
    setInProgress(true)
    onSubmit(values).then(() => {
      setInProgress(false)
    })
  }

  return (
    <>
      <Messages messages={inner.messages} />

      {inner.fields.map((field: FormField) => (
        <Field
          disabled={inProgress}
          key={field.name}
          value={getValue(field.name)}
          onChange={onChange(field.name)}
          field={field}
        />
      ))}

      <Button disabled={inProgress} title={submitLabel} onPress={onPress} />
    </>
  )
}

export default Form
