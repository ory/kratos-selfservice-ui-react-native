import React from 'react'
import {
  FormField,
  GenericError,
  LoginFlow,
  LoginFlowMethodConfig,
  RecoveryFlow,
  RecoveryFlowMethodConfig,
  RegistrationFlow,
  RegistrationFlowMethodConfig,
  SettingsFlow,
  SettingsFlowMethodConfig,
  VerificationFlow,
  VerificationFlowMethodConfig
} from '@oryd/kratos-client'
import { AxiosError } from 'axios'
import { getPosition } from '../translations'
import { showMessage } from 'react-native-flash-message'

export function camelize<T>(str: string) {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase()) as keyof T
}

export function getFieldValue<T>(
  key: string,
  fields: Array<FormField>,
  fallback: T
): T {
  const field = fields.find(({ name }) => name == key)
  if (field) {
    return (field.value as unknown) as T
  }

  return fallback
}

export const fieldsToKeyMap = (fields: Array<FormField>) => {
  const proto: { [key: string]: any } = {}

  fields.forEach((field) => {
    proto[field.name] = field.value as any
  })

  return proto
}

export function handleFlowInitError(err: AxiosError) {
  return
}

export function handleFormSubmitError<T>(
  setConfig: (p: T) => void,
  initialize: () => void,
  logout?: () => void
) {
  return (err: AxiosError) => {
    if (err.response) {
      switch (err.response.status) {
        case 400:
          if (typeof err.response.data.error === 'object') {
            console.warn(err.response.data)

            const ge: GenericError = err.response.data
            showMessage({
              message: `${ge.error?.message}: ${ge.error?.reason}`,
              type: 'danger'
            })

            return Promise.resolve()
          }

          console.warn('Form validation failed:', err.response.data)
          setConfig(err.response.data)
          return Promise.resolve()
        case 404:
        case 410:
          // This happens when the flow is, for example, expired or was deleted.
          // We simply re-initialize the flow if that happens!
          console.warn('Flow could not be found, reloading page.')
          initialize()
          return Promise.resolve()
        case 403:
        case 401:
          if (!logout) {
            console.error(
              `Received unexpected 401/403 status code: `,
              err,
              err.response.data
            )
            return Promise.resolve()
          }

          // This happens when the privileged session is expired but the user tried
          // to modify a privileged field (e.g. change the password).
          console.warn(
            'The server indicated that this action is not allowed for you. The most likely cause of that is that you modified a privileged field (e.g. your password) but your ORY Kratos Login Session is too old.'
          )
          showMessage({
            message: 'Please re-authenticate before making these changes.',
            type: 'warning'
          })
          logout()
          return Promise.resolve()
      }
    }

    console.error(err, err.response?.data)
    return Promise.resolve()
  }
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
):
  | LoginFlowMethodConfig
  | RegistrationFlowMethodConfig
  | RecoveryFlowMethodConfig
  | SettingsFlowMethodConfig
  | VerificationFlowMethodConfig
  | undefined => {
  if (flow.active && flow.active !== key) {
    // The flow has an active method but it is not the one we're looking at -> return empty
    return
  }

  if (!flow.methods[key]) {
    // The flow method is apparently not configured -> return empty
    return
  }

  const config = flow.methods[key].config

  // We want the form fields to be sorted so that the email address is first, the
  // password second, and so on.
  config?.fields.sort(
    (first: FormField, second: FormField) =>
      getPosition(first) - getPosition(second)
  )

  return config
}
