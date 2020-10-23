import { theme } from '@oryd/themes'

export default (parent) => ({
  ...parent.config,
  extra: {
    kratosUrl:
      process.env.KRATOS_URL ||
      'https://public.api.staging.projects.oryapis.dev'
  },
  splash: {
    ...parent.config.splash,
    backgroundColor: theme.grey5
  },
  platforms: ['ios', 'android']
})
