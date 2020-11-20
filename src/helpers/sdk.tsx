import { Configuration, PublicApi } from '@oryd/kratos-client'
import Constants from 'expo-constants'
import axiosFactory from 'axios'
import { resilience } from './axios'

const axios = axiosFactory.create()
resilience(axios) // Adds retry mechanism to axios

// canonicalize removes the trailing slash from URLs.
const canonicalize = (url: string = '') => url.replace(/\/+$/, '')

export const kratosUrl =
  // This value comes from ../../app.config.js
  canonicalize(Constants.manifest?.extra?.kratosUrl) || ''

export const newKratosSdk = (token?: string) =>
  new PublicApi(
    new Configuration({
      basePath: kratosUrl,
      apiKey: token,
      baseOptions: {
        // Setting this is very important as axios will send the CSRF cookie otherwise
        // which causes problems with ORY Kratos' security detection.
        withCredentials: false,

        // Timeout after 5 seconds.
        timeout: 5000
      }
    }),
    '',
    // Ensure that we are using the axios client with retry.
    axios
  )

// This exports the ORY Kratos SDK
export default newKratosSdk()
