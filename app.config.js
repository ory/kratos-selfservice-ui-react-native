export default (parent) => ({
  ...parent.config,
  extra: {
    kratosUrl:
      process.env.KRATOS_URL ||
      'https://public.api.staging.projects.oryapis.dev'
  },
  splash: {
    ...parent.config.splash,
    backgroundColor: '#F0F0F1' // @oryd/themes/theme.grey5:
  },
  platforms: ['ios', 'android']
})
