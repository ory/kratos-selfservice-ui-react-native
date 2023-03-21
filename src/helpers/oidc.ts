// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { AuthRequestPromptOptions, AuthSessionResult } from "expo-auth-session"

type promptAsyncFn = (
  options?: AuthRequestPromptOptions,
) => Promise<AuthSessionResult>

export async function getIDToken(
  promptAsync: promptAsyncFn,
): Promise<string | undefined> {
  try {
    const result = await promptAsync()
    if (result.type === "success") {
      console.log(
        "Received a successful response from the OIDC provider: ",
        result.params,
      )
      if (!result.params.id_token) {
        console.error(
          "Did not receive a valid id_token from the provider. The registration request work succeed. You probably need to configure the provider to return an id_token.",
          result,
        )
        return
      } else {
        return result.params.id_token
      }
    } else {
      console.error(
        "The user did not accept consent, the request was blocked, or failed for some other reason: ",
        result,
      )
    }
  } catch (e) {
    console.error("Got unexpected error while prompting user for consent: ", e)
  }
}
