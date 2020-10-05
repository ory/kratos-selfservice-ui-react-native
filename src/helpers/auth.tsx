// This file handles the authentication state.

import {
  LoginViaApiResponse,
  RegistrationViaApiResponse,
  Session as KratosSession,
} from '@oryd/kratos-client';
import * as SecureStore from 'expo-secure-store';
import AsyncStore from '@react-native-community/async-storage';
import { Platform } from 'react-native';

// The key under which the session is being stored
const userSessionName = 'user_session';

// The session type
interface Session extends KratosSession {
  // The session token
  sessionToken: string;
}

// getAuthenticatedSession returns a promise with the session of the authenticated user, if the
// user is authenticated or null is the user is not authenticated.
//
// If an error (e.g. network error) occurs, the promise rejects with an error.
export const getAuthenticatedSession = (): Promise<Session | null> => {
  const parse = (sessionRaw: string | null) => {
    if (!sessionRaw) {
      return null;
    }

    // sessionRaw is a JSON String that needs to be parsed.
    return JSON.parse(sessionRaw);
  };

  if (Platform.OS === 'web') {
    // SecureStore is not available on the web platform. We need to use AsyncStore
    // instead.

    return AsyncStore.getItem(userSessionName).then(parse);
  }

  return SecureStore.getItemAsync(userSessionName).then(parse);
};

// Sets the session.
export const setAuthenticatedSession = (
  session: RegistrationViaApiResponse | LoginViaApiResponse
): Promise<Session | null> => {
  if (!session.session_token) {
    return Promise.reject(
      new Error(
        'Expected the session to have a session token but received none.'
      )
    );
  }

  if (Platform.OS === 'web') {
    // SecureStore is not available on the web platform. We need to use AsyncStore
    // instead.

    return AsyncStore.setItem(userSessionName, JSON.stringify(session)).then(
      getAuthenticatedSession
    );
  }

  return (
    SecureStore
      // The SecureStore only supports strings so we encode the session.
      .setItemAsync(userSessionName, JSON.stringify(session))
      .then(getAuthenticatedSession)
  );
};

// Removes the session from the store.
export const killAuthenticatedSession = () => {
  if (Platform.OS === 'web') {
    // SecureStore is not available on the web platform. We need to use AsyncStore
    // instead.

    return AsyncStore.removeItem(userSessionName);
  }

  return SecureStore.deleteItemAsync(userSessionName);
};
