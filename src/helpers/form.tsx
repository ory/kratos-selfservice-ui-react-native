import React from 'react';
import {
  LoginFlow,
  RegistrationFlow,
  FlowMethodConfig,
  FormField,
} from '@oryd/kratos-client';
import { AxiosError } from 'axios';

// This helper returns a request method config (e.g. for the password flow).
// If active is set and not the given request method key, it wil be omitted.
// This prevents the user from e.g. signing up with email but still seeing
// other sign up form elements when an input is incorrect.
export const methodConfig = (
  config: LoginFlow | RegistrationFlow | undefined,
  key: string
): FlowMethodConfig | undefined => {
  if (config?.active === key || !config?.active) {
    return config?.methods[key]?.config;
  }
};

export function camelize(str: string) {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}

export function getFieldValue<T>(
  key: string,
  fields: Array<FormField>,
  fallback: T
): T {
  const field = fields.find(({ name }) => name == key);
  if (field) {
    return (field.value as unknown) as T;
  }

  return fallback;
}

export const fieldsToKeyMap = (fields: Array<FormField>) => {
  const proto: { [key: string]: any } = {};

  fields.forEach((field) => {
    proto[field.name] = field.value as any;
  });

  return proto;
};

export function handleFormSubmitError<T>(setConfig: (p: T) => void) {
  return (err: AxiosError) => {
    if (err.response?.status === 400) {
      console.log('Received error', err.response.data);
      setConfig(err.response.data);
      return;
    }

    console.error(err, err.response?.data);
    return;
  };
}
