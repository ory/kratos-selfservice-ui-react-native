import React from 'react';
import { FormField } from '@oryd/kratos-client';
import { getTitle } from '../../translations';
import StyledTextInput from '../Styled/StyledTextInput';
import { Message } from '@oryd/kratos-client/api';
import Messages from './Messages';
import StyledText from '../Styled/StyledText';
import { TextInputProps } from 'react-native';

interface Props {
  field: FormField;
  value: any;
  onChange: (value: string) => void;
  messages?: Array<Message>;
  variant?: 'text' | 'password' | 'email' | 'username';
}

const TextField = ({
  field: { name, messages },
  variant = 'text',
  value,
  onChange,
}: Props) => {
  const extraProps: TextInputProps = {};
  switch (variant) {
    case 'email':
      extraProps.autoCompleteType = 'email';
      extraProps.keyboardType = 'email-address';
      extraProps.textContentType = 'emailAddress';
      break;
    case 'password':
      extraProps.autoCompleteType = 'password';
      extraProps.textContentType = 'password';
      break;
    case 'username':
      extraProps.autoCompleteType = 'username';
      extraProps.textContentType = 'username';
      break;
  }

  return (
    <>
      <StyledText variant="h3">{getTitle(name)}</StyledText>
      <StyledTextInput
        {...extraProps}
        value={value ? String(value) : ''}
        onChangeText={onChange}
      />
      <Messages messages={messages} />
    </>
  );
};

export default TextField;
