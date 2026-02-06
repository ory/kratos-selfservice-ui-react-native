import { UiText } from "@ory/client-fetch"
import { messageStyles } from "@ory/themes"
import React from "react"
import { View } from "react-native"
import styled from "styled-components/native"

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
