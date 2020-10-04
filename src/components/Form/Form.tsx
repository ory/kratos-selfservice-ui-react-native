import React, {useState} from 'react'
import {FormField, FlowMethodConfig} from "@oryd/kratos-client";
import {Button} from "react-native";
import PasswordField from "./PasswordField";
import TextField from "./TextField";
import EmailField from './EmailField';

interface Props {
  config: FlowMethodConfig
  onSubmit: (config: Array<FormField>) => void
  submitLabel: string
}

const Form = ({config, onSubmit, submitLabel}: Props) => {
  const [fields, setFields] = useState(config.fields)

  const onChange = (name: string) => (value: any) => {
    setFields(fields.map((field) => field.name === name
      ? {
        ...field,
        value: value
      }
      : field
    ))
  }

  return (
    <>
      {fields.map((field) => {
        if (field.name === 'identifier') {

        }

        switch (field.type) {
          case 'hidden':
            return null
          case 'email':
            return <EmailField key={field.name} field={field} onChange={onChange(field.name)}/>
          case 'submit':
            return null
          case 'password':
            return <PasswordField key={field.name} field={field} onChange={onChange(field.name)}/>
          default:
            return <TextField key={field.name} field={field} onChange={onChange(field.name)}/>
        }
      })}

      <Button
        title={submitLabel}
        onPress={() => onSubmit(fields)}
      />
    </>
  )
}

export default Form
