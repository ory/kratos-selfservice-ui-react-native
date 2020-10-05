import { FormField } from '@oryd/kratos-client';
import TextField from './TextField';
import React from 'react';

interface FieldProps {
  field: FormField;
  onChange: (value: any) => void;
  value: any;
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

export default ({ field, value, onChange }: FieldProps) => {
  const variant = guessVariant(field);
  if (!variant) {
    return null;
  }

  return (
    <TextField
      variant={variant}
      key={field.name}
      field={field}
      value={value}
      onChange={onChange}
    />
  );
};
