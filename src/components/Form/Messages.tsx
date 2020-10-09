import React from 'react'
import { Message } from '@oryd/kratos-client/api'
import { messageStyles } from '@oryd/themes'
import styled from 'styled-components/native'

interface Props {
  messages?: Array<Message>
}

const MessageText = styled.Text(messageStyles)

export default ({ messages = [] }: Props) => (
  <>
    {messages.map(({ text, id }, k) => (
      <MessageText key={`${id}${k}`}>{text}</MessageText>
    ))}
  </>
)
