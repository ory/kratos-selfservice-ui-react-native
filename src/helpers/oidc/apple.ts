// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FrontendApi } from "@ory/client"
import * as AppleAuthentication from "expo-apple-authentication"
import * as Crypto from "expo-crypto"

async function signInWithApplePayload(): Promise<{
  id_token: string
  raw_id_token_nonce: string
  traits: Record<string, unknown>
}> {
  const nonce = Crypto.getRandomBytes(16).toString()
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    nonce,
  )
  let credential: AppleAuthentication.AppleAuthenticationCredential
  try {
    credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      ],
      nonce: digest,
    })
  } catch (e) {
    console.error("Couldn't sign in with Apple: ", e)
    throw e
  }

  return {
    id_token: credential.identityToken || "",
    raw_id_token_nonce: nonce,
    traits: {
      name: {
        first: credential.fullName?.givenName || "given name",
        last: credential.fullName?.familyName || "last name",
      },
    },
  }
}

export async function signInWithApple(sdk: FrontendApi, flowId: string) {
  const payload = await signInWithApplePayload()
  return sdk.updateLoginFlow({
    flow: flowId,
    updateLoginFlowBody: {
      method: "oidc",
      provider: "apple",
      ...payload,
    },
  })
}

export async function registerWithApple(sdk: FrontendApi, flowId: string) {
  const payload = await signInWithApplePayload()
  return sdk.updateRegistrationFlow({
    flow: flowId,
    updateRegistrationFlowBody: {
      method: "oidc",
      provider: "apple",
      ...payload,
    },
  })
}
