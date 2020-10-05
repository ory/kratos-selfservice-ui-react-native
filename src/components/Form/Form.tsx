import React, { useState } from 'react';
import {
  LoginFlow,
  RegistrationFlow,
  Session,
  SettingsFlow,
} from '@oryd/kratos-client';
import Button from '../Styled/StyledButton';
import Messages from './Messages';
import { camelize, methodConfig } from '../../helpers/form';
import Field from './Field';

interface Props {
  config: LoginFlow | RegistrationFlow | SettingsFlow;
  method: 'password' | 'profile' | 'link';
  onSubmit: <T>(payload: T) => Promise<Session | null>;
  submitLabel: string;
}

interface AnyMap {
  [name: string]: any;
}

const Form = ({ config, onSubmit, submitLabel, method }: Props) => {
  // The Form component keeps track of all the field values in the form.
  // To do so, we initialize
  const initialState: AnyMap = {};
  const inner = methodConfig(config, method);

  if (!inner) {
    return null;
  }

  inner.fields.forEach((field) => {
    initialState[field.name] = field.value || '';
  });

  const [values, setValues] = useState(initialState);
  const [inProgress, setInProgress] = useState(false);

  const onChange = (name: string) => (value: any) => {
    setValues((values) => ({
      ...values,
      [name]: value,
    }));
  };

  const getValue = (name: string) => values[camelize(name)];
  const onPress = () => {
    setInProgress(true);
    onSubmit(values).then(() => {
      setInProgress(false);
    });
  };

  return (
    <>
      <Messages messages={inner.messages} />

      {inner.fields.map((field) => (
        <Field
          disabled={inProgress}
          key={field.name}
          value={getValue(field.name)}
          onChange={onChange(field.name)}
          field={field}
        />
      ))}

      <Button disabled={inProgress} title={submitLabel} onPress={onPress} />
    </>
  );
};

export default Form;
