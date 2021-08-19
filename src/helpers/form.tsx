import React from 'react'
import {
  GenericError,
  UiNode,
  UiNodeAnchorAttributes,
  UiNodeImageAttributes,
  UiNodeInputAttributes,
  UiNodeTextAttributes
} from '@ory/kratos-client'
import { AxiosError } from 'axios'
import { showMessage } from 'react-native-flash-message'
import { UiNodeAttributes } from '@ory/kratos-client'

export function camelize<T>(str: string) {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase()) as keyof T
}

export function isUiNodeAnchorAttributes(
  pet: UiNodeAttributes
): pet is UiNodeAnchorAttributes {
  return (pet as UiNodeAnchorAttributes).href !== undefined
}

export function isUiNodeImageAttributes(
  pet: UiNodeAttributes
): pet is UiNodeImageAttributes {
  return (pet as UiNodeImageAttributes).src !== undefined
}

export function isUiNodeInputAttributes(
  pet: UiNodeAttributes
): pet is UiNodeInputAttributes {
  return (pet as UiNodeInputAttributes).name !== undefined
}

export function isUiNodeTextAttributes(
  pet: UiNodeAttributes
): pet is UiNodeTextAttributes {
  return (pet as UiNodeTextAttributes).text !== undefined
}

export function getNodeId({ attributes }: UiNode) {
  if (isUiNodeInputAttributes(attributes)) {
    return attributes.name
  } else {
    return attributes.id
  }
}

export function getNodeValue({ attributes }: UiNode) {
  if (isUiNodeInputAttributes(attributes)) {
    return attributes.value
  }

  return ''
}

export const getNodeTitle = ({ attributes, meta }: UiNode): string => {
  if (isUiNodeInputAttributes(attributes)) {
    if (meta?.label?.text) {
      return meta.label.text
    }
    return attributes.name
  }

  if (meta?.label?.text) {
    return meta.label.text
  }

  return ''
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
            const ge: GenericError = err.response.data
            showMessage({
              message: `${ge.message}: ${ge.reason}`,
              type: 'danger'
            })

            return Promise.resolve()
          }

          console.debug('Form validation failed:', err.response.data)
          setConfig(err.response.data)
          return Promise.resolve()
        case 404:
        case 410:
          // This happens when the flow is, for example, expired or was deleted.
          // We simply re-initialize the flow if that happens!
          console.debug('Flow could not be found, reloading page.')
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
