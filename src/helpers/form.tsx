import React from 'react';
import {
  LoginFlow,
  PublicApi,
  RegistrationFlow,
  FlowMethodConfig,
  FormField, Configuration,
} from '@oryd/kratos-client';

// This helper returns a request method config (e.g. for the password flow).
// If active is set and not the given request method key, it wil be omitted.
// This prevents the user from e.g. signing up with email but still seeing
// other sign up form elements when an input is incorrect.
export const methodConfig = (config: LoginFlow | RegistrationFlow | undefined, key: string): FlowMethodConfig | undefined => {
  if (config?.active === key || !config?.active) {
    return config?.methods[key]?.config;
  }
};

export const fieldsToProto = (proto: { [key: string]: any }, fields: Array<FormField>) => {
  Object.keys(proto).forEach((key) => {
    const field = fields.find(({ name }) => name === key);
    if (field) {
      proto[key] = field.name as any;
    }
  });

  return proto;
};

export const fieldsToKeyMap = (fields: Array<FormField>) => {
  const proto: { [key: string]: any } = {};

  fields.forEach((field) => {
    proto[field.name] = field.value as any;
  });

  return proto;
};
