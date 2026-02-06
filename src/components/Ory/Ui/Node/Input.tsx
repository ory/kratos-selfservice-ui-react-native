import {
  instanceOfUiNodeInputAttributes,
  UiNode,
  UiNodeInputAttributes,
} from "@ory/client-fetch"
import { textInputSubtitleStyles, textInputTitleStyles } from "@ory/themes"
import React from "react"
import { TextInputProps, View } from "react-native"
import styled from "styled-components/native"
import { getNodeId, getNodeTitle } from "../../../../helpers/form"
import StyledTextInput from "../../../Styled/StyledTextInput"
import Checkbox from "../../../Styled/Checkbox"

interface Props extends InputProps {
  node: UiNode
  attributes: UiNodeInputAttributes
}

export interface InputProps {
  onChange: (value: any) => void
  value: any
  disabled?: boolean
  textInputOverride?: TextInputOverride
}

export type TextInputOverride = (
  field: UiNode,
  props: TextInputProps,
) => TextInputProps

const guessVariant = ({ attributes }: UiNode) => {
  if (!instanceOfUiNodeInputAttributes(attributes)) {
    return "text"
  }

  if (attributes.name === "identifier") {
    return "username"
  }

  switch (attributes.type) {
    case "hidden":
      return null
    case "email":
      return "email"
    case "submit":
      return "button"
    case "password":
      return "password"
    case "checkbox":
      return "checkbox"
    default:
      return "text"
  }
}

const typeToState = ({
  type,
  disabled,
}: {
  type?: string
  disabled?: boolean
}) => {
  if (disabled) {
    return "disabled"
  }
  switch (type) {
    case "error":
      return "error"
  }
  return undefined
}

const Title = styled.Text(textInputTitleStyles)
const Subtitle = styled.Text(textInputSubtitleStyles)

export const NodeInput = ({
  node,
  value,
  onChange,
  disabled,
  textInputOverride,
}: Props) => {
  const variant = guessVariant(node)
  if (!variant) {
    return null
  }

  let extraProps: TextInputProps = {}
  switch (variant) {
    case "email":
      extraProps.autoComplete = "email"
      extraProps.keyboardType = "email-address"
      extraProps.textContentType = "emailAddress"
      extraProps.autoCapitalize = "none"
      extraProps.autoCorrect = false
      break
    case "password":
      extraProps.autoComplete = "password"
      extraProps.textContentType = "password"
      extraProps.autoCapitalize = "none"
      extraProps.secureTextEntry = true
      extraProps.autoCorrect = false
      break
    case "username":
      extraProps.autoComplete = "username"
      extraProps.textContentType = "username"
      extraProps.autoCapitalize = "none"
      extraProps.autoCorrect = false
      break
  }

  if (textInputOverride) {
    extraProps = textInputOverride(node, extraProps)
  }

  const name = getNodeId(node)
  const title = getNodeTitle(node)

  return (
    <View testID={`field/${name}`}>
      <Title>{title}</Title>
      {variant === "checkbox" ? (
        <Checkbox
          testID={name}
          onValueChange={() => onChange(!value)}
          value={value}
          disabled={disabled}
        />
      ) : (
        <StyledTextInput
          testID={name}
          value={value ? String(value) : ""}
          editable={!disabled}
          onChangeText={onChange}
          state={disabled ? "disabled" : undefined}
          {...extraProps}
        />
      )}
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
