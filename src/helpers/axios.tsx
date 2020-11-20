// A small which adds retries to axios

import { AxiosInstance } from 'axios'

export const resilience = (axios: AxiosInstance) => {
  axios.interceptors.response.use(
    (v) => Promise.resolve(v),
    (error) => {
      if (!error.config) {
        return Promise.reject(error)
      }

      if (
        error.response &&
        (error.response.status >= 400 || error.response.status <= 500)
      ) {
        // 401 status is ok
        return Promise.reject(error)
      }

      const config = {
        ...error.config,
        retryAttempt: (error.config.retryAttempt || 0) + 1,
        timeout: error.config.timeout + 1000
      }

      if (config.retryAttempt > 15) {
        console.warn('Aborting request after 15 retries:', { config, error })
        return Promise.reject(error)
      }

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          axios.request(config).then(resolve).catch(reject)
        }, 500)
      })
    }
  )
}
