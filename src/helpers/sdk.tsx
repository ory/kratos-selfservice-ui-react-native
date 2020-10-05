import { Configuration, PublicApi, Session } from '@oryd/kratos-client';
import Constants from 'expo-constants';
import { CompleteSelfServiceLoginFlowWithPasswordMethod } from '@oryd/kratos-client/api';
import { setAuthenticatedSession } from './auth';
import { handleFormSubmitError } from './form';

const url = Constants.manifest?.extra?.kratosUrl || '';

// canonicalize removes the trailing slash from URLs.
const canonicalize = (url: string = '') => url.replace(/\/+$/, '/');

const kratos = new PublicApi(
  new Configuration({
    basePath: canonicalize(url),
  })
);

export function loginWithPassword<T>(
  flow: string,
  setConfig: (payload: T) => void
) {
  return (
    body: CompleteSelfServiceLoginFlowWithPasswordMethod
  ): Promise<Session | null> =>
    kratos
      .completeSelfServiceLoginFlowWithPasswordMethod(flow, body)
      .then(({ data }) => setAuthenticatedSession(data))
      .catch(handleFormSubmitError(setConfig));
}

export function registrationWithPassword<T>(
  flow: string,
  setConfig: (payload: T) => void
) {
  return (payload: Object): Promise<Session | null> =>
    kratos
      .completeSelfServiceRegistrationFlowWithPasswordMethod(flow, payload)
      .then(({ data }) => {
        if (!data.session_token || !data.session) {
          const err = new Error(
            'It looks like you configured ORY Kratos to not issue a session automatically after registration. This edge-case is currently not supported in this example app. You can find more information on enabling this feature here: https://www.ory.sh/kratos/docs/next/self-service/flows/user-registration#successful-registration'
          );
          return Promise.reject(err);
        }
        const session: Session = data.session;

        return setAuthenticatedSession(data).then(() =>
          Promise.resolve(session)
        );
      })
      .catch(handleFormSubmitError(setConfig));
}

// This exports the ORY Kratos SDK
export default kratos;
