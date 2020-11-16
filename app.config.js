export default (parent) => ({
  ...parent.config,
  extra: {
    kratosUrl:
      process.env.KRATOS_URL ||
      'https://demo.tenants.staging.oryapis.dev/api/kratos/public'
  },
  splash: {
    ...parent.config.splash,
    backgroundColor: '#F0F0F1' // @oryd/themes/theme.grey5:
  },
  platforms: ['ios', 'android']
})
