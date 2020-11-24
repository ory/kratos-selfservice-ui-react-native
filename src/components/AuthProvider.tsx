// This file defines a React Context which keeps track of the authenticated session.

import React, { createContext, ReactNode, useEffect, useState } from 'react'
import {
  getAuthenticatedSession,
  killAuthenticatedSession,
  SessionContext,
  setAuthenticatedSession
} from '../helpers/auth'
import { AxiosError } from 'axios'
import { newKratosSdk } from '../helpers/sdk'
import { Session } from '@oryd/kratos-client'

interface Context {
  session?: Session
  sessionToken?: string
  setSession: (session: SessionContext) => void
  syncSession: () => Promise<void>
  didFetch: boolean
  isAuthenticated: boolean
}

export const AuthContext = createContext<Context>({
  setSession: () => {},
  syncSession: () => Promise.resolve(),
  didFetch: false,
  isAuthenticated: false
})

interface AuthContextProps {
  children: ReactNode
}

export default ({ children }: AuthContextProps) => {
  const [sessionContext, setSessionContext] = useState<
    SessionContext | undefined
  >(undefined)

  // Fetches the authentication session.
  useEffect(() => {
    getAuthenticatedSession().then(syncSession)
  }, [])

  const syncSession = (auth: SessionContext) => {
    if (!auth) {
      return setAuth(null)
    }

    // Use the session token from the auth session:
    return (
      newKratosSdk(auth.session_token)
        // whoami() returns the session belonging to the session_token:
        .whoami()
        .then(({ data: session }) => {
          // This means that the session is still valid! The user is logged in.
          //
          // Here you could print the user's email using e.g.:
          //
          //  console.log(session.identity.traits.email)
          setSessionContext({ session, session_token: auth.session_token })
          return Promise.resolve()
        })
        .catch((err: AxiosError) => {
          if (err.response?.status === 401) {
            // The user is no longer logged in (hence 401)
            console.log('Session is not authenticated:', err)
          } else {
            // A network or some other error occurred
            console.error(err)
          }

          // Remove the session / log the user out.
          setSessionContext(null)
        })
    )
  }

  const setAuth = (session: SessionContext) => {
    if (!session) {
      return killAuthenticatedSession().then(() => setSessionContext(session))
    }

    setAuthenticatedSession(session).then(() => syncSession(session))
  }

  if (sessionContext === undefined) {
    return null
  }

  return (
    <AuthContext.Provider
      value={{
        // The session information
        session: sessionContext?.session,
        sessionToken: sessionContext?.session_token,

        // Is true when the user has a session
        isAuthenticated: Boolean(sessionContext?.session_token),

        // Fetches the session from the server
        syncSession: () => getAuthenticatedSession().then(syncSession),

        // Allows to override the session
        setSession: setAuth,

        // Is true if we have fetched the session.
        didFetch: true
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
