import {
  FormField,
  LoginFlow,
  RecoveryFlow,
  RegistrationFlow,
  SettingsFlow,
  VerificationFlow,
} from '@oryd/kratos-client';

const translations = {
  password: {
    title: 'Password',
    position: 2,
  },
  'traits.email': {
    title: 'E-Mail',
    position: 1,
  },
  identifier: {
    title: 'E-Mail',
    position: 0,
  },
  to_verify: {
    title: 'Your email address',
    position: 0,
  },
};

type Translations = typeof translations;

export const getTitle = (key: string): string =>
  key in translations ? translations[key as keyof Translations].title : key;

const getPosition = (field: FormField) =>
  field.name && field.name in translations
    ? translations[field.name as keyof Translations].position
    : Infinity;

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
