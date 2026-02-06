import {
  ContinueWith,
  ErrorBrowserLocationChangeRequired,
  ExchangeSessionTokenRequest,
  GenericError,
  instanceOfUiNodeInputAttributes,
  LoginFlow,
  RecoveryFlow,
  RegistrationFlow,
  UiNode,
  VerificationFlow,
} from "@ory/client-fetch"
import * as AuthSession from "expo-auth-session"
import * as WebBrowser from "expo-web-browser"
import { showMessage } from "react-native-flash-message"
import { SessionContext } from "./auth"
import { logSDKError, HttpError, isResponseError, parseResponseError } from "./errors"
import { newOrySdk } from "./sdk"

type Flow = LoginFlow | RegistrationFlow | VerificationFlow | RecoveryFlow

export function camelize<T>(str: string) {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase()) as keyof T
}

export function getNodeId({ attributes }: UiNode) {
  if (instanceOfUiNodeInputAttributes(attributes)) {
    return attributes.name
  } else {
    return attributes.id
  }
}

export function getNodeValue({ attributes }: UiNode) {
  if (instanceOfUiNodeInputAttributes(attributes)) {
    return attributes.value
  }

  return ""
}

export const getNodeTitle = ({ attributes, meta }: UiNode): string => {
  if (instanceOfUiNodeInputAttributes(attributes)) {
    if (meta?.label?.text) {
      return meta.label.text
    }
    return attributes.name
  }

  if (meta?.label?.text) {
    return meta.label.text
  }

  return ""
}

function isErrorGeneric(data: unknown): data is { error: GenericError } {
  return (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    typeof data.error === "object"
  )
}

function isRedirectBrowserToError(
  data: unknown,
): data is ErrorBrowserLocationChangeRequired {
  return (
    typeof data === "object" && data !== null && "redirect_browser_to" in data
  )
}

export function handleFormSubmitError<
  T extends RegistrationFlow | LoginFlow | VerificationFlow | undefined,
>(
  flow: T,
  setFlow: (p: T) => void,
  initializeFlow: (fId?: string) => void,
  setSession: (p: SessionContext) => void,
  refetchFlow: () => Promise<void>,
  logout?: () => void,
  handleContinueWith?: (c: ContinueWith[]) => Promise<void>,
) {
  // Inner function that handles HttpError
  const handleHttpError = (err: HttpError) => {
    logSDKError(err)
    if (err.response) {
      switch (err.response.status) {
        case 400:
          if (isErrorGeneric(err.response.data)) {
            const ge = err.response.data.error
            showMessage({
              message: `${ge.message}: ${ge.reason}`,
              type: "danger",
            })

            return Promise.resolve()
          }

          console.debug(
            "Form validation failed:",
            JSON.stringify(err.response.data),
          )
          setFlow(err.response.data as T)
          return Promise.resolve()
        case 404:
          console.debug("Flow could not be found, re-initializing the flow.")
          initializeFlow()
          return Promise.resolve()
        case 410: {
          // This happens when the flow is, for example, expired or was deleted.
          // Sometimes, Ory returns a replacement flow here
          console.debug("The flow expired, re-initializing the flow.")
          const errorData = err.response.data as { error?: { details?: { continue_with?: ContinueWith[] } } } | undefined
          const continueWith = errorData?.error?.details?.continue_with
          if (Array.isArray(continueWith) && handleContinueWith) {
            return handleContinueWith(continueWith)
          }
          initializeFlow()
          return Promise.resolve()
        }
        case 403:
        case 401:
          if (!logout) {
            console.error(
              `Received unexpected 401/403 status code: `,
              err,
              err.response.data as unknown,
            )
            return Promise.resolve()
          }

          // This happens when the privileged session is expired but the user tried
          // to modify a privileged field (e.g. change the password).
          console.warn(
            "The server indicated that this action is not allowed for you. The most likely cause of that is that you modified a privileged field (e.g. your password) but your Ory Identities Login Session is too old.",
          )
          showMessage({
            message: "Please re-authenticate before making these changes.",
            type: "warning",
          })
          logout()
          return Promise.resolve()
        case 422:
          console.log(
            "The server responded with a 422 error, which indicates that to complete this action, the user needs to fulfil additional steps.",
            JSON.stringify(err.response.data, null, 2),
          )
          if (
            isRedirectBrowserToError(err.response.data) &&
            err.response.data.redirect_browser_to
          ) {
            handleRedirectBrowserTo(
              err.response.data.redirect_browser_to,
              flow as any,
              setSession,
              refetchFlow,
            )
          }
          return Promise.resolve()
      }
    }

    return Promise.resolve()
  }

  // Return async function that handles both ResponseError and HttpError
  return async (err: unknown) => {
    if (isResponseError(err)) {
      const httpError = await parseResponseError(err)
      return handleHttpError(httpError)
    }
    return handleHttpError(err as HttpError)
  }
}

async function handleRedirectBrowserTo(
  url: string,
  flow: LoginFlow | RegistrationFlow | undefined,
  setSession: (p: SessionContext) => void,
  refetchFlow: () => Promise<void>,
) {
  const fetchToken = (params: ExchangeSessionTokenRequest) =>
    newOrySdk("").exchangeSessionToken(params)
  const setToken = (res: Awaited<ReturnType<typeof fetchToken>>) =>
    res?.session_token &&
    setSession({
      session: res.session,
      session_token: res.session_token,
    })

  const result = await WebBrowser.openAuthSessionAsync(
    url,
    AuthSession.makeRedirectUri({
      preferLocalhost: true,
      path: "/Callback",
    }),
  )
  if (result.type == "success") {
    // We can fetch the session token now!
    const initCode = flow?.session_token_exchange_code
    if (!initCode) {
      console.log(
        "The code from the flow is missing, refetching flow. This is likely due to an error in the flow.",
        JSON.stringify(flow),
      )
      return refetchFlow()
    }
    const returnToCode = new URL(result.url).searchParams.get("code")
    if (!returnToCode) {
      console.log(
        "The provider did not include a code, refetching flow. This is likely due to an error in the flow.",
        "The url was: ",
        result.url,
      )
      return refetchFlow()
    }
    fetchToken({ initCode, returnToCode })
      .then(setToken)
      .catch(() => {
        console.log("failed to get session")
        refetchFlow()
      })
  } else {
    console.log("authentication canceled, refetching flow")
    return refetchFlow()
  }
}
