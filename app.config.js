export default (parent) => ({
  ...parent.config,
  extra: {
    kratosUrl:
      process.env.KRATOS_URL ||
      'https://demo.tenants.staging.oryapis.dev/api/kratos/public'
  }
})
