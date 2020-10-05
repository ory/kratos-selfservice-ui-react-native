import { FormField } from '@oryd/kratos-client';
import React from 'react';
import { TextInputProps } from 'react-native';
import StyledText from '../Styled/StyledText';
import { getTitle } from '../../translations';
import StyledTextInput from '../Styled/StyledTextInput';
import Messages from './Messages';

interface FieldProps {
  field: FormField;
  onChange: (value: any) => void;
  value: any;
  disabled?: boolean;
}

const guessVariant = (field: FormField) => {
  if (field.name === 'identifier') {
    return 'username';
  }

  switch (field.type) {
    case 'hidden':
      return null;
    case 'email':
      return 'email';
    case 'submit':
      return null;
    case 'password':
      return 'password';
    default:
      return 'text';
  }
};

export default ({ field, value, onChange, disabled }: FieldProps) => {
  const variant = guessVariant(field);
  if (!variant) {
    return null;
  }

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
      extraProps.secureTextEntry = true;
      break;
    case 'username':
      extraProps.autoCompleteType = 'username';
      extraProps.textContentType = 'username';
      break;
  }

  return (
    <>
      <StyledText variant="h3">{getTitle(field.name)}</StyledText>
      <StyledTextInput
        key={field.name}
        onChange={onChange}
        value={value ? String(value) : ''}
        editable={!disabled}
        onChangeText={onChange}
        {...extraProps}
      />
      <Messages messages={field.messages} />
    </>
  );
};
