# Ory Kratos React Native Self-Service UI Reference

This is an exemplary Self Service UI for
[Ory Kratos](https://github.com/ory/kratos) Self Service features:

- Registration
- Login
- Logout
- User settings
  - Update profile
  - Change password

Additionally:

- Dashboard (requires login)

## Quickstart

There is an excellent write-up available on implementing
[Mobile Login with Username / Email and Password in React Native](https://www.ory.com/blog/login-react-native-authentication-example-api)
but if you want to go ahead and just try it out, do the following:

1. Run the [Ory Kratos quickstart](https://ory.com/docs/kratos/quickstart) on
   your local machine.
1. Use [`ngrok`](http://ngrok.com) to expose the Ory Kratos public port to the
   public internet (`ngrok http 4433`).
1. Install this project's dependencies with `npm i`.
1. Use the resulting URL and start the environment using
   `KRATOS_URL=https://<your-ngrok-id>.ngrok.io npm start`. Please note that the
   Web Interface is not working currently due to security features implemented
   in Ory Kratos.
