import StyledText from '../Styled/StyledText';
import React from 'react';
import { Message } from '@oryd/kratos-client/api';

interface Props {
  messages?: Array<Message>;
}

export default ({ messages = [] }: Props) => (
  <>
    {messages.map(({ text, id }, k) => (
      <StyledText key={`${id}${k}`}>{text}</StyledText>
    ))}
  </>
);
