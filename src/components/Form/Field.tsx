import { FormField } from '@oryd/kratos-client'
import React from 'react'
import { TextInput, TextInputProps, View } from 'react-native'
import StyledText from '../Styled/StyledText'
import { getTitle } from '../../translations'
import StyledTextInput from '../Styled/StyledTextInput'
import Messages from './Messages'
import styled from 'styled-components/native'
import { textInputSubtitleStyles, textInputTitleStyles } from '@oryd/themes'

interface FieldProps {
  field: FormField
  onChange: (value: any) => void
  value: any
  disabled?: boolean
}

const guessVariant = (field: FormField) => {
  if (field.name === 'identifier') {
    return 'username'
  }

  switch (field.type) {
    case 'hidden':
      return null
    case 'email':
      return 'email'
    case 'submit':
      return null
    case 'password':
      return 'password'
    default:
      return 'text'
  }
}

const Title = styled.Text(textInputTitleStyles)
const Subtitle = styled.Text(textInputSubtitleStyles)

const typeToState = ({
  type,
  disabled
}: {
  type?: string
  disabled?: boolean
}) => {
  if (disabled) {
    return 'disabled'
  }
  switch (type) {
    case 'error':
      return 'error'
  }
  return undefined
}

export default ({ field, value, onChange, disabled }: FieldProps) => {
  const variant = guessVariant(field)
  if (!variant) {
    return null
  }

  const extraProps: TextInputProps = {}
  switch (variant) {
    case 'email':
      extraProps.autoCompleteType = 'email'
      extraProps.keyboardType = 'email-address'
      extraProps.textContentType = 'emailAddress'
      break
    case 'password':
      extraProps.autoCompleteType = 'password'
      extraProps.textContentType = 'password'
      extraProps.secureTextEntry = true
      break
    case 'username':
      extraProps.autoCompleteType = 'username'
      extraProps.textContentType = 'username'
      break
  }

  return (
    <View testID={`field/${field.name}`}>
      <Title>{getTitle(field.name)}</Title>
      <StyledTextInput
        testID={field.name}
        key={field.name}
        onChange={onChange}
        value={value ? String(value) : ''}
        editable={!disabled}
        onChangeText={onChange}
        state={disabled ? 'disabled' : undefined}
        {...extraProps}
      />
      <>
        {field.messages?.map(({ text, id, type }, k) => (
          <Subtitle key={`${id}${k}`} state={typeToState({ type, disabled })}>
            {text}
          </Subtitle>
        ))}
      </>
    </View>
  )
}
