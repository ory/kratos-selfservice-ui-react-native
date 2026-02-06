import { Configuration, FrontendApi } from "@ory/client-fetch"
import Constants from "expo-constants"

const REQUEST_TIMEOUT_MS = 30000

// fetchWithTimeout wraps fetch with an AbortController to prevent requests
// from hanging indefinitely on flaky networks.
const fetchWithTimeout: typeof fetch = (input, init) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  return fetch(input, {
    ...init,
    signal: controller.signal,
  }).finally(() => clearTimeout(timeoutId))
}

// canonicalize removes the trailing slash from URLs.
const canonicalize = (url: string = "") => url.replace(/\/+$/, "")

// This value comes from ../../app.config.js
export const kratosUrl = (project: string = "playground") => {
  const url = canonicalize(Constants.expoConfig?.extra?.kratosUrl) || ""

  if (url.indexOf("https://playground.projects.oryapis.com/") == -1) {
    // The URL is not from Ory, so let's just return it.
    return url
  }

  // We handle a special case where we allow the project to be changed
  // if you use an ory project.
  return url.replace("playground.", `${project}.`)
}

export const newOrySdk = (project: string) =>
  new FrontendApi(
    new Configuration({
      basePath: kratosUrl(project),
      // Setting credentials to 'omit' is important as fetch will send cookies otherwise
      // which causes problems with Ory Kratos' security detection.
      credentials: "omit",
      // Accept header is required to receive JSON responses from Kratos.
      // Without it, Kratos treats requests as browser requests and returns HTML redirects.
      headers: {
        Accept: "application/json",
      },
      fetchApi: fetchWithTimeout,
    }),
  )
