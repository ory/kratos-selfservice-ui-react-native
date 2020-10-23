import React from 'react'
import { Message } from '@oryd/kratos-client/api'
import { messageStyles } from '@oryd/themes'
import styled from 'styled-components/native'
import { View } from 'react-native'

interface Props {
  messages?: Array<Message>
  testID?: string
}

const MessageText = styled.Text(messageStyles)

export default ({ messages = [], testID }: Props) => (
  <View testID={testID}>
    {messages.map(({ text, id }, k) => (
      <MessageText key={`${id}${k}`}>{text}</MessageText>
    ))}
  </View>
)
