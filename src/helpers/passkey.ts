import { Platform } from "react-native"

const isWeb = Platform.OS === "web"

/**
 * Extract the Relying Party ID from a Kratos base URL.
 * Returns the hostname (e.g., "localhost" or "your-project.projects.oryapis.com").
 */
export function getRelyingPartyId(kratosBaseUrl: string): string {
  try {
    const url = new URL(kratosBaseUrl)
    return url.hostname
  } catch {
    return "localhost"
  }
}

// --- Registration options ---

export interface ParsedRegistrationOptions {
  challenge: string
  rp: {
    name: string
    id: string
  }
  user: {
    id: string
    name: string
    displayName: string
  }
  pubKeyCredParams: Array<{
    type: "public-key"
    alg: number
  }>
  timeout?: number
  attestation?: AttestationConveyancePreference
  excludeCredentials?: Array<{
    type: "public-key"
    id: string
    transports?: AuthenticatorTransport[]
  }>
  authenticatorSelection?: AuthenticatorSelectionCriteria
}

/**
 * Parse the passkey_create_data value from a Kratos registration flow.
 *
 * Kratos returns: { credentialOptions: { publicKey: { ... } } }
 */
export function parseRegistrationOptions(
  passkeyCreateData: string,
): ParsedRegistrationOptions {
  try {
    const data = JSON.parse(passkeyCreateData)
    const publicKey =
      data.credentialOptions?.publicKey || data.publicKey || data

    return {
      challenge: publicKey.challenge,
      rp: publicKey.rp,
      user: publicKey.user,
      pubKeyCredParams: publicKey.pubKeyCredParams,
      timeout: publicKey.timeout,
      attestation: publicKey.attestation,
      excludeCredentials: publicKey.excludeCredentials,
      authenticatorSelection: publicKey.authenticatorSelection,
    }
  } catch (error) {
    throw new Error(`Failed to parse passkey registration options: ${error}`)
  }
}

// --- Login options ---

export interface ParsedLoginOptions {
  challenge: string
  rpId: string
  timeout?: number
  userVerification?: UserVerificationRequirement
  allowCredentials?: Array<{
    type: "public-key"
    id: string
    transports?: AuthenticatorTransport[]
  }>
}

/**
 * Parse the passkey_challenge value from a Kratos login flow.
 *
 * Kratos returns: { publicKey: { challenge, rpId, timeout, ... } }
 */
export function parseLoginOptions(
  passkeyChallenge: string,
  fallbackRpId?: string,
): ParsedLoginOptions {
  try {
    const data = JSON.parse(passkeyChallenge)
    const publicKey = data.publicKey || data

    return {
      challenge: publicKey.challenge,
      rpId: publicKey.rpId || fallbackRpId || "localhost",
      timeout: publicKey.timeout || 60000,
      userVerification: publicKey.userVerification || "preferred",
      allowCredentials: publicKey.allowCredentials,
    }
  } catch {
    return {
      challenge: passkeyChallenge,
      rpId: fallbackRpId || "localhost",
      timeout: 60000,
      userVerification: "preferred",
    }
  }
}

// --- Support detection ---

/**
 * Check if passkey authentication is supported on the current device.
 */
export async function isPasskeySupported(): Promise<boolean> {
  if (isWeb) {
    if (
      typeof window !== "undefined" &&
      window.PublicKeyCredential &&
      typeof window.PublicKeyCredential
        .isUserVerifyingPlatformAuthenticatorAvailable === "function"
    ) {
      try {
        return await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
      } catch {
        return false
      }
    }
    return false
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const ExpoPasskeyModule = require("expo-passkey/native").default
    return ExpoPasskeyModule.isPasskeySupported()
  } catch {
    if (Platform.OS === "ios") {
      const version = parseInt(Platform.Version as string, 10)
      return version >= 16
    }
    if (Platform.OS === "android") {
      const version = Platform.Version as number
      return version >= 28
    }
    return false
  }
}

// --- Registration ceremony ---

export async function performRegistration(
  options: ParsedRegistrationOptions,
): Promise<string> {
  if (isWeb) {
    return performWebRegistration(options)
  }
  return performNativeRegistration(options)
}

async function performWebRegistration(
  options: ParsedRegistrationOptions,
): Promise<string> {
  const { startRegistration } = await import("@simplewebauthn/browser")

  const webAuthnOptions = {
    challenge: options.challenge,
    rp: options.rp,
    user: {
      id: options.user.id,
      name: options.user.name,
      displayName: options.user.displayName,
    },
    pubKeyCredParams: options.pubKeyCredParams,
    timeout: options.timeout || 60000,
    attestation: options.attestation || ("none" as const),
    excludeCredentials: options.excludeCredentials?.map((cred) => ({
      id: cred.id,
      type: cred.type,
      transports: cred.transports,
    })),
    authenticatorSelection: options.authenticatorSelection,
  }

  const credential = await startRegistration({ optionsJSON: webAuthnOptions })

  return JSON.stringify({
    id: credential.id,
    rawId: credential.rawId,
    type: credential.type,
    response: {
      clientDataJSON: credential.response.clientDataJSON,
      attestationObject: credential.response.attestationObject,
      transports: credential.response.transports,
    },
    clientExtensionResults: credential.clientExtensionResults || {},
  })
}

async function performNativeRegistration(
  options: ParsedRegistrationOptions,
): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ExpoPasskeyModule = require("expo-passkey/native").default

  const requestJson = JSON.stringify({
    challenge: options.challenge,
    rp: options.rp,
    user: options.user,
    pubKeyCredParams: options.pubKeyCredParams,
    timeout: options.timeout,
    attestation: options.attestation,
    excludeCredentials: options.excludeCredentials,
    authenticatorSelection: options.authenticatorSelection,
  })

  const credentialJson = await ExpoPasskeyModule.createPasskey({ requestJson })
  return credentialJson
}

// --- Login ceremony ---

export async function performLogin(
  options: ParsedLoginOptions,
): Promise<string> {
  if (isWeb) {
    return performWebLogin(options)
  }
  return performNativeLogin(options)
}

async function performWebLogin(options: ParsedLoginOptions): Promise<string> {
  const { startAuthentication } = await import("@simplewebauthn/browser")

  const webAuthnOptions = {
    challenge: options.challenge,
    rpId: options.rpId,
    timeout: options.timeout || 60000,
    userVerification: options.userVerification || "preferred",
    allowCredentials: options.allowCredentials?.map((cred) => ({
      id: cred.id,
      type: cred.type,
      transports: cred.transports,
    })),
  }

  const credential = await startAuthentication({
    optionsJSON: webAuthnOptions,
  })

  return JSON.stringify({
    id: credential.id,
    rawId: credential.rawId,
    type: credential.type,
    response: {
      clientDataJSON: credential.response.clientDataJSON,
      authenticatorData: credential.response.authenticatorData,
      signature: credential.response.signature,
      userHandle: credential.response.userHandle,
    },
    clientExtensionResults: credential.clientExtensionResults || {},
  })
}

async function performNativeLogin(
  options: ParsedLoginOptions,
): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ExpoPasskeyModule = require("expo-passkey/native").default

  const requestJson = JSON.stringify({
    challenge: options.challenge,
    rpId: options.rpId,
    timeout: options.timeout,
    userVerification: options.userVerification,
    allowCredentials: options.allowCredentials,
  })

  const credentialJson = await ExpoPasskeyModule.authenticateWithPasskey({
    requestJson,
  })
  return credentialJson
}

// --- Error handling ---

export enum PasskeyErrorType {
  NotSupported = "NotSupported",
  Cancelled = "Cancelled",
  InvalidState = "InvalidState",
  NotAllowed = "NotAllowed",
  SecurityError = "SecurityError",
  Unknown = "Unknown",
}

export interface PasskeyError {
  type: PasskeyErrorType
  message: string
  originalError?: unknown
}

export function parsePasskeyError(error: unknown): PasskeyError {
  const errorMessage = error instanceof Error ? error.message : String(error)
  const errorName = error instanceof Error ? error.name : ""

  if (
    errorName === "NotSupportedError" ||
    errorMessage.includes("not supported")
  ) {
    return {
      type: PasskeyErrorType.NotSupported,
      message: "Passkey authentication is not supported on this device.",
      originalError: error,
    }
  }

  if (
    errorName === "NotAllowedError" ||
    errorMessage.includes("not allowed") ||
    errorMessage.includes("cancelled") ||
    errorMessage.includes("canceled")
  ) {
    return {
      type: PasskeyErrorType.Cancelled,
      message: "Passkey authentication was cancelled.",
      originalError: error,
    }
  }

  if (
    errorName === "InvalidStateError" ||
    errorMessage.includes("invalid state")
  ) {
    return {
      type: PasskeyErrorType.InvalidState,
      message: "A passkey for this account already exists.",
      originalError: error,
    }
  }

  if (errorName === "SecurityError" || errorMessage.includes("security")) {
    return {
      type: PasskeyErrorType.SecurityError,
      message: "Security error during passkey authentication.",
      originalError: error,
    }
  }

  return {
    type: PasskeyErrorType.Unknown,
    message:
      errorMessage ||
      "An unknown error occurred during passkey authentication.",
    originalError: error,
  }
}
