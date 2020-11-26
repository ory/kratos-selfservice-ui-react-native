import { FormField } from '@oryd/kratos-client';
import React from 'react';
import { TextInputProps, View } from 'react-native';
import { getTitle } from '../../translations';
import StyledTextInput from '../Styled/StyledTextInput';
import styled from 'styled-components/native';
import { textInputSubtitleStyles, textInputTitleStyles } from '@oryd/themes';

interface FieldProps {
  field: FormField
  onChange: (value: any) => void
  value: any
  disabled?: boolean
  fieldTypeOverride?: (field: FormField, props: TextInputProps) => TextInputProps
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

const Title = styled.Text(textInputTitleStyles);
const Subtitle = styled.Text(textInputSubtitleStyles);

const typeToState = ({
                       type,
                       disabled,
                     }: {
  type?: string
  disabled?: boolean
}) => {
  if (disabled) {
    return 'disabled';
  }
  switch (type) {
    case 'error':
      return 'error';
  }
  return undefined;
};

export default ({ field, value, onChange, disabled, fieldTypeOverride }: FieldProps) => {
  const variant = guessVariant(field);
  if (!variant) {
    return null;
  }

  let extraProps: TextInputProps = {};
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

  if (fieldTypeOverride) {
    extraProps = fieldTypeOverride(field, extraProps);
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
  );
}
