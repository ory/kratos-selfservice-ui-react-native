import React from "react"
import { messageStyles } from "@ory/themes"
import styled from "styled-components/native"
import { View } from "react-native"
import { UiText } from "@ory/kratos-client"

interface Props {
  messages?: Array<UiText>
  testID?: string
}

const MessageText = styled.Text(messageStyles)

export default ({ messages = [], testID }: Props) => (
  <View testID={testID}>
    {messages.map(({ text, id }, k) => (
      <MessageText testID={`ui/message/${id}`} key={`${id}${k}`}>
        {text}
      </MessageText>
    ))}
  </View>
)
