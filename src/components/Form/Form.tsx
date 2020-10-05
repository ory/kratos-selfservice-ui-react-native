import React, { useState } from 'react';
import { FormField, FlowMethodConfig } from '@oryd/kratos-client';
import Button from '../Styled/StyledButton';
import Messages from './Messages';
import { camelize } from '../../helpers/form';
import Field from './Field';

interface Props {
  config: FlowMethodConfig;
  onSubmit: <T>(payload: T) => void;
  submitLabel: string;
}

const Form = ({ config, onSubmit, submitLabel }: Props) => {
  const initialState: { [key: string]: any } = {};
  config.fields.forEach((field) => {
    initialState[camelize(field.name)] = field.value || '';
  });

  const [values, setValues] = useState(initialState);

  const onChange = (name: string) => (value: any) => {
    setValues((values) => ({
      ...values,
      [camelize(name)]: value,
    }));
  };

  const getValue = (name: string) => values[camelize(name)];

  return (
    <>
      <Messages messages={config.messages} />

      {config.fields.map((field) => (
        <Field
          key={field.name}
          value={getValue(field.name)}
          onChange={onChange(field.name)}
          field={field}
        />
      ))}

      <Button title={submitLabel} onPress={() => onSubmit(values)} />
    </>
  );
};

export default Form;
