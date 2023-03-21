export default (parent = {}) => {
  // We gracefully destruct these parameters to avoid "undefined" errors:
  const { config = {} } = parent
  const { env = {} } = process || {}

  const {
    // This is the URL of your deployment. In our case we use the ORY Demo
    // environment
    KRATOS_URL = "https://playground.projects.oryapis.com",

    // We use sentry.io for error tracing. This helps us identify errors
    // in the distributed packages. You can remove this.
    SENTRY_DSN = "https://8be94c41dbe34ce1b244935c68165eab@o481709.ingest.sentry.io/5530799",

    // If you want to use OIDC add the client id here:
    OIDC_CLIENT_ID = "",

    //
    OIDC_PROVIDER_URL = "",
  } = env

  return {
    ...config,
    extra: {
      kratosUrl: KRATOS_URL,
      sentryDsn: SENTRY_DSN,
      oidcClientId: OIDC_CLIENT_ID,
    },
  }
}
