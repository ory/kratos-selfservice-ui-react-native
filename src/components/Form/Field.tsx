import { UiNode } from '@ory/kratos-client'
import React from 'react'
import { TextInputProps, View } from 'react-native'
import { getTitle } from '../../translations'
import StyledTextInput from '../Styled/StyledTextInput'
import styled from 'styled-components/native'
import { textInputSubtitleStyles, textInputTitleStyles } from '@ory/themes'
import {
  getNodeName,
  getNodeTitle,
  isUiNodeInputAttributes
} from '../../helpers/form'

interface FieldProps {
  node: UiNode
  onChange: (value: any) => void
  value: any
  disabled?: boolean
  fieldTypeOverride?: (field: UiNode, props: TextInputProps) => TextInputProps
}

const guessVariant = ({ attributes }: UiNode) => {
  if (!isUiNodeInputAttributes(attributes)) {
    return 'text'
  }

  if (attributes.name === 'identifier') {
    return 'username'
  }

  switch (attributes.type) {
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

export default ({
  node,
  value,
  onChange,
  disabled,
  fieldTypeOverride
}: FieldProps) => {
  const variant = guessVariant(node)
  if (!variant) {
    return null
  }

  let extraProps: TextInputProps = {}
  switch (variant) {
    case 'email':
      extraProps.autoCompleteType = 'email'
      extraProps.keyboardType = 'email-address'
      extraProps.textContentType = 'emailAddress'
      extraProps.autoCapitalize = 'none'
      extraProps.autoCorrect = false
      break
    case 'password':
      extraProps.autoCompleteType = 'password'
      extraProps.textContentType = 'password'
      extraProps.autoCapitalize = 'none'
      extraProps.secureTextEntry = true
      extraProps.autoCorrect = false
      break
    case 'username':
      extraProps.autoCompleteType = 'username'
      extraProps.textContentType = 'username'
      extraProps.autoCapitalize = 'none'
      extraProps.autoCorrect = false
      break
  }

  if (fieldTypeOverride) {
    extraProps = fieldTypeOverride(node, extraProps)
  }

  const name = getNodeName(node)
  const title = getNodeTitle(node)

  return (
    <View testID={`field/${name}`}>
      <Title>{title}</Title>
      <StyledTextInput
        testID={name}
        onChange={onChange}
        value={value ? String(value) : ''}
        editable={!disabled}
        onChangeText={onChange}
        state={disabled ? 'disabled' : undefined}
        {...extraProps}
      />
      <>
        {node.messages?.map(({ text, id, type }, k) => (
          <Subtitle key={`${id}${k}`} state={typeToState({ type, disabled })}>
            {text}
          </Subtitle>
        ))}
      </>
    </View>
  )
}
