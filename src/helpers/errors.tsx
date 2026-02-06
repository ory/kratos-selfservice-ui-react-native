// Helper utilities for HTTP error handling
import { ResponseError } from "@ory/client-fetch"

export interface HttpError {
  response?: {
    status: number
    data: unknown
  }
  config?: {
    url?: string
    method?: string
  }
  message?: string
}

export function isHttpError(e: unknown): e is HttpError {
  return (
    typeof e === "object" &&
    e !== null &&
    "response" in e &&
    typeof (e as HttpError).response === "object"
  )
}

// Check if error is a fetch-based ResponseError from @ory/client-fetch.
// Uses duck typing instead of instanceof because webpack may bundle the local
// file: package into a separate module instance, causing instanceof to fail.
export function isResponseError(e: unknown): e is ResponseError {
  if (e instanceof ResponseError) return true
  return (
    typeof e === "object" &&
    e !== null &&
    "response" in e &&
    typeof (e as any).response === "object" &&
    (e as any).response !== null &&
    typeof (e as any).response.status === "number" &&
    typeof (e as any).response.json === "function"
  )
}

// Convert a ResponseError to HttpError format for compatibility
export async function parseResponseError(e: ResponseError): Promise<HttpError> {
  let data: unknown = undefined
  try {
    data = await e.response.json()
  } catch {
    // Response body may not be JSON or already consumed
  }
  return {
    response: {
      status: e.response.status,
      data,
    },
    message: e.message,
  }
}

function containsGenericError(
  data: unknown,
): data is { error: { id?: string; reason?: string } & Record<string, unknown> } {
  if (!data) {
    return false
  }
  if (typeof data !== "object") {
    return false
  }

  if (!("error" in data)) {
    return false
  }

  const e = (data as { error: unknown }).error
  return typeof e === "object" && !!e
}

export function logSDKError(e: unknown): void {
  if (!isHttpError(e)) {
    console.error("Something went wrong", JSON.stringify(e, null, 2))
    return
  }
  const data = e.response?.data

  if (!containsGenericError(data)) {
    console.error("Something went wrong", {
      status: e.response?.status,
      url: e.config?.url,
      message: e.message,
    })
    return
  }

  let message = undefined
  switch (data.error.id) {
    case "self_service_flow_return_to_forbidden":
      message =
        "Your project does not allow to return to the app. Please add the URL to the allowed_return_to URLs."
      break
  }

  console.error(
    message || data.error.reason || "Something went wrong",
    "\n\n",
    "error details:",
    JSON.stringify(data.error, null, 2),
  )
  return
}
