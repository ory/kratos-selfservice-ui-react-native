import React from 'react';
import {
  FormField,
  LoginFlow,
  RecoveryFlow,
  RegistrationFlow,
  SettingsFlow,
  VerificationFlow,
} from '@oryd/kratos-client';
import { AxiosError } from 'axios';
import { getPosition } from '../translations';

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
      console.warn('Form validation failed:', err.response.data);
      setConfig(err.response.data);
      return null;
    }

    console.error(err, err.response?.data);
    return null;
  };
}

// This helper returns a flow method config (e.g. for the password flow).
// If active is set and not the given flow method key, it wil be omitted.
// This prevents the user from e.g. signing up with email but still seeing
// other sign up form elements when an input is incorrect.
//
// It also sorts the form fields so that e.g. the email address is first.
export const methodConfig = (
  flow:
    | LoginFlow
    | RegistrationFlow
    | RecoveryFlow
    | SettingsFlow
    | VerificationFlow,
  key: string
) => {
  if (flow.active && flow.active !== key) {
    // The flow has an active method but it is not the one we're looking at -> return empty
    return;
  }

  if (!flow.methods[key]) {
    // The flow method is apparently not configured -> return empty
    return;
  }

  const config = flow.methods[key].config;

  // We want the form fields to be sorted so that the email address is first, the
  // password second, and so on.
  config?.fields.sort(
    (first: FormField, second: FormField) =>
      getPosition(first) - getPosition(second)
  );

  return config;
};
