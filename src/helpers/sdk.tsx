import {
  Configuration,
  LoginViaApiResponse,
  PublicApi,
  RegistrationViaApiResponse,
  Session
} from '@oryd/kratos-client'
import Constants from 'expo-constants'
import { CompleteSelfServiceLoginFlowWithPasswordMethod } from '@oryd/kratos-client/api'
import { SessionContext, setAuthenticatedSession } from './auth'
import { handleFormSubmitError } from './form'

// canonicalize removes the trailing slash from URLs.
const canonicalize = (url: string = '') => url.replace(/\/+$/, '/')

export const kratosUrl =
  canonicalize(Constants.manifest?.extra?.kratosUrl) || ''

const kratos = new PublicApi(new Configuration({ basePath: kratosUrl }))

export const kratosWithSessionToken = (token: string) =>
  new PublicApi(new Configuration({ basePath: kratosUrl, apiKey: token }))

// This exports the ORY Kratos SDK
export default kratos
