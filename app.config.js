export default (parent = {}) => {
  const { config = {} } = parent

  const { env = {} } = process || {}

  const {
    KRATOS_URL = 'https://demo.tenants.staging.oryapis.dev/api/kratos/public',
    SENTRY_DSN = 'https://8be94c41dbe34ce1b244935c68165eab@o481709.ingest.sentry.io/5530799'
  } = env

  return {
    ...config,
    extra: {
      kratosUrl: KRATOS_URL,
      sentryDsn: SENTRY_DSN
    }
  }
}
