export default (parent) => ({
  ...parent.config,
  extra: {
    kratosUrl: process.env.KRATOS_URL,
  },
});
