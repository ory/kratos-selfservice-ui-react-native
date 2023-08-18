// A small which adds retries to axios

import { AxiosError, AxiosInstance } from "axios"

export const resilience = (axios: AxiosInstance) => {
  axios.interceptors.response.use(
    (v) => Promise.resolve(v),
    (error, ...args) => {
      if (!error.config) {
        console.error("Received network error without axios details", error)
        return Promise.reject(error)
      }

      if (
        error.response &&
        (error.response.status == 400 ||
          error.response.status == 401 ||
          error.response.status == 403)
      ) {
        console.debug("Network request failed but this is ok", {
          config: error.config,
          error,
        })
        return Promise.reject(error)
      }

      if (
        error.response &&
        (error.response.status >= 400 || error.response.status < 500)
      ) {
        // 4xx status means we should not retry.
        console.error("Network request failed", { config: error.config, error })
        return Promise.reject(error)
      }

      const config = {
        ...error.config,
        timeout: 1000,
        count: (error?.config?.count || 0) + 1,
      }

      if (config.count > 60) {
        const err = new Error(
          "Unable to reach network, gave up after 60 retries. Please restart the app and try again.",
        )
        console.error(err, { config: error.config, error })
        return Promise.reject(err)
      }

      console.debug("Retrying due to network error", {
        count: error.config.count,
        error,
      })
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          axios.request(config).then(resolve).catch(reject)
        }, 1000)
      })
    },
  )
}

// TODO: remove once we upgrade axios
export function isAxiosError(e: any, status?: number): e is AxiosError {
  return !!e?.isAxiosError && (!status || e.response?.status === status)
}
export function logSDKError(e: unknown): void {
  if (!isAxiosError(e)) {
    console.error("Something went wrong", JSON.stringify(e, null, 2))
    return
  }
  const data = e.response?.data

  let message = undefined
  switch (data.error.id) {
    case "self_service_flow_return_to_forbidden":
      message =
        "Your project does not allow to return to the app. Please add the URL to the allowed_return_to URLs."
      break
  }

  console.error(
    message || data.error.message || "Something went wrong",
    "\n",
    "error details:",
    JSON.stringify(data.error, null, 2),
  )
  return
}
