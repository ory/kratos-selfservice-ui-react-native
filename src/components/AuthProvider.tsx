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

    // setAuth({ session: null, session_token: auth.session_token });
    // hasFetched(false);
    return newKratosSdk(auth.session_token)
      .whoami()
      .then(({ data: session }) => {
        setSessionContext({ session, session_token: auth.session_token })
        return Promise.resolve()
      })
      .catch((err: AxiosError) => {
        if (err.response?.status === 401) {
          console.log('Session is not authenticated:', err)
        } else {
          console.error(err)
        }

        setSessionContext(null)
      })
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
        session: sessionContext?.session,
        sessionToken: sessionContext?.session_token,
        isAuthenticated: Boolean(sessionContext?.session_token),
        syncSession: () => getAuthenticatedSession().then(syncSession),
        setSession: setAuth,
        didFetch: true
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
