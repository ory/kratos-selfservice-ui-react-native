import {
  ErrorBrowserLocationChangeRequired,
  FrontendApiExchangeSessionTokenRequest,
  GenericError,
  LoginFlow,
  RecoveryFlow,
  RegistrationFlow,
  UiNode,
  UiNodeAnchorAttributes,
  UiNodeAttributes,
  UiNodeImageAttributes,
  UiNodeInputAttributes,
  UiNodeTextAttributes,
  VerificationFlow,
} from "@ory/client"
import { AxiosError } from "axios"
import * as WebBrowser from "expo-web-browser"
import { showMessage } from "react-native-flash-message"
import { SessionContext } from "./auth"
import { newOrySdk } from "./sdk"
import * as AuthSession from "expo-auth-session"

type Flow = LoginFlow | RegistrationFlow | VerificationFlow | RecoveryFlow

export function camelize<T>(str: string) {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase()) as keyof T
}

export function isUiNodeAnchorAttributes(
  pet: UiNodeAttributes,
): pet is UiNodeAnchorAttributes {
  return (pet as UiNodeAnchorAttributes).href !== undefined
}

export function isUiNodeImageAttributes(
  pet: UiNodeAttributes,
): pet is UiNodeImageAttributes {
  return (pet as UiNodeImageAttributes).src !== undefined
}

export function isUiNodeInputAttributes(
  pet: UiNodeAttributes,
): pet is UiNodeInputAttributes {
  return (pet as UiNodeInputAttributes).name !== undefined
}

export function isUiNodeTextAttributes(
  pet: UiNodeAttributes,
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

  return ""
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
  initializeFlow: () => void,
  setSession: (p: SessionContext) => void,
  refetchFlow: () => Promise<void>,
  logout?: () => void,
) {
  return (err: AxiosError) => {
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
          setFlow(err.response.data)
          return Promise.resolve()
        case 404:
        case 410:
          // This happens when the flow is, for example, expired or was deleted.
          // We simply re-initialize the flow if that happens!
          console.debug("Flow could not be found, re-initializing the flow.")
          initializeFlow()
          return Promise.resolve()
        case 403:
        case 401:
          if (!logout) {
            console.error(
              `Received unexpected 401/403 status code: `,
              err,
              err.response.data,
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

    console.error(err, err.response?.data)
    return Promise.resolve()
  }
}

async function handleRedirectBrowserTo(
  url: string,
  flow: LoginFlow | RegistrationFlow | undefined,
  setSession: (p: SessionContext) => void,
  refetchFlow: () => Promise<void>,
) {
  const fetchToken = (params: FrontendApiExchangeSessionTokenRequest) =>
    newOrySdk("").exchangeSessionToken(params)
  const setToken = (res: Awaited<ReturnType<typeof fetchToken>>) =>
    res?.data.session_token &&
    setSession({
      session: res.data.session,
      session_token: res.data.session_token,
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
