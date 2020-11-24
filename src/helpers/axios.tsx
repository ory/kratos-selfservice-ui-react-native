// A small which adds retries to axios

import { AxiosInstance } from 'axios'

export const resilience = (axios: AxiosInstance) => {
  axios.interceptors.response.use(
    (v) => Promise.resolve(v),
    (error) => {
      console.info('Received network error', error)

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
        timeout: 1000
      }

      console.info('Retrying network error', error)
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          axios.request(config).then(resolve).catch(reject)
        }, 500)
      })
    }
  )
}
