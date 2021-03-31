import React, { useState } from 'react'
import {
  FormField,
  LoginFlow,
  RegistrationFlow,
  SettingsFlow
} from '@ory/kratos-client'
import Button from '../Styled/StyledButton'
import Messages from './Messages'
import { camelize, methodConfig } from '../../helpers/form'
import Field from './Field'
import {
  CompleteSelfServiceLoginFlowWithPasswordMethod,
  CompleteSelfServiceSettingsFlowWithPasswordMethod
} from '@ory/kratos-client/api'
import { TextInputProps, View } from 'react-native'

interface Props<T> {
  config?: LoginFlow | RegistrationFlow | SettingsFlow
  method: 'password' | 'profile' | 'link'
  onSubmit: (payload: T) => Promise<void>
  submitLabel: string
  fieldTypeOverride?: (
    field: FormField,
    props: TextInputProps
  ) => TextInputProps
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
  method,
  fieldTypeOverride
}: Props<T>) => {
  if (!config) {
    return null
  }

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
      <Messages testID="form-messages" messages={inner.messages} />
      {inner.fields.map((field: FormField, k) => (
        <Field
          key={`form-field-${inner?.action || ''}-${field.name}-${k}`}
          fieldTypeOverride={fieldTypeOverride}
          disabled={inProgress}
          value={getValue(field.name)}
          onChange={onChange(field.name)}
          field={field}
        />
      ))}

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
