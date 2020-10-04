# kratos-selfservice-ui-react-native

This is an example mobile app which integrates with ORY Kratos. While this app uses React Native to be
cross-platform, the patterns it implements are applicable to iOS Swift, Android Java SDK.

If this is your first time using React Native, please
[https://reactnative.dev/docs/environment-setup](set up the React Native development environment).

Next, run the web task using:

```shell script
$ npm start
```

**Please note that starting the iOS or Android simulator may require a significant amount of time, which is
related to the way React Native works and not to this code base itself.**

## Approaches

There are several possibilities to implement login for mobile apps:

- Username / Email and Password
- Social Sign In / OAuth2 / OpenID Connect
  - With "Facebook Login"
  - Without "Facebook Login"

### Mobile Login with Username / Email and Password

There is a common misconception that you need OAuth2 or OpenID Connect to perform username / email and password
login for your own users. Many online resources get these things wrong:

Myth: The mobile app is "untrusted" because it can be modified by everyone and is therefor a third-party in OAuth2 terms;  
Truth: The browser is as untrusted as a mobile app. Both use HTTP and TCP to perform tasks against an API. One is not
more secure than the other.  

Myth: OAuth2 is the only way to get secure "tokens";  
Truth: OAuth2 is the only secure way to get access to a third party's (a different company) API. OAuth2 is not
required to exchange e.g. a username and a password for a session token and most popular
mobile apps use this much simpler approach.

Now that we've established that OAuth2 is not required to log in your users in your own mobile app, let's take a look
at the high-level network flow:

<Mermaid>

</Mermaid>

### Mobile Login with Social Sign In / OAuth2 / OpenID Connect

When implementing social sign in / OAuth2 / OpenID Connect on mobile application there are two possibilities:

1. Easy: You let ORY Kratos handle the third-party login (e.g. Sign in with Google).
2. Hard, better UX: Your mobile app uses the third-party's SDKs (e.g. Google Android SDK, LinkedIn iOS Mobile SDK, ...) to perform
login and uses the result to exchange it for a ORY Kratos login session.

In some cases you may have to use a combination of the two. This is especially true when using "Facebook Login"
because [Facebook's Platform Policy](https://developers.facebook.com/policy/) requires you to use their SDK
when implementing Facebook Login on mobile apps!

https://developers.facebook.com/docs/facebook-login/access-tokens/session-info-access-token/

You may still use the API-based flow for Username / Email and Password login.

#### OAuth 2.0 / OpenID Connect Authorize Code flow with PKCE

 When the user taps, for example, "Sign in with Google",
you generate an OAuth2 / OpenID Connect request for ORY Kratos which contains the login provider's ID:
```
https://<kratos-url>
```

Your mobile application performs an OAuth 2.0 / OpenID Connect Authorize Code flow with PKCE against ORY Kratos.
ORY Kratos acts as a "proxy" for the third-party login. It handles all the client IDs and secrets, exchanges the tokens,
and logs the user into his/her account.

All you have to do in your mobile App is to add a button and use - for example - 

#### SDKs with Token Exchange



#### Add Facebook Login

### OAuth2 and OpenID Connect

### Dismissed Ideas

#### WebView with Cookies

The simplest approach would be to just load the login page and wait for the user to sign up / in
and then extract the cookie as shown in this snippet
[from the react-native-webview GitHub](https://github.com/react-native-community/react-native-webview/issues/629#issuecomment-516867912):

```jsx
const getCookiesJS = "ReactNativeWebView.postMessage(document.cookie)";
return (
  <WebView 
      injectedJavaScript={getCookiesJS}
      onMessage={event => console.log(event.nativeEvent.data)}
      source={{ uri: "https://www.example.com/auth/login" }}
      javaScriptEnabled={true}
  />
);
```

Because ORY Kratos' cookies are `secure` and `httpOnly`, `document.cookie` does not have access to the session cookie
rendering this approach impossible.

#### Cookies in General

React Native has trouble working with cookies. There are libraries such as [react-native-cookies](https://github.com/react-native-community/cookies)
available but all approaches have limitations:

- React Native has several known issues and limitations as documented in [react-native#23185](https://github.com/facebook/react-native/issues/23185);
- `react-native-cookies` does not work with Expo, on macOS, Windows, Web.

## Guide

Let's build an iOS/Android app using React Native! This tutorial outlines how to implement
user login, user registration, user settings, user logout, account recovery and password reset,
email and phone verification, password change, multi-factor and 2fa authentication, and several other
core "user authentication" flows in React Native using ORY Kratos.

This guide assumes that you have worked with React and React Native before as we will not cover
React fundamentals and focus mostly on implementing login, registration, and so on.

You can find the full React Native application source code on
[GitHub](https://github.com/ory/kratos-selfservice-ui-react-native).

## Create React Native Template

We will use the Expo CLI as it is the easiest to get started with. Set up your project as follows:

```shell script
npm install -g expo-cli
expo init AwesomeProject
```

Use the `blank (TypeScript)` template. Now open your project and start it:

```shell script
cd AwesomeProject
npm start
```

## Add Navigation

To set up screen navigation, we use the standard React Native navigation component. To install it, run:

```shell script
npm add @react-navigation/native @react-navigation/stack
expo install react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view
```

## Add Encrypted Credentials Storage

This application uses [`expo-secure-store`](https://docs.expo.io/versions/latest/sdk/securestore/)
to securely store the user's session key in the encrypted
device store (Android Keystore / Expo Secure Store). To install it we'll run:

```shell script
expo install expo-secure-store
# For iOS you also need to run:
npx pod-install
```

## Mobile Application Screens

Our application has several screens:

- Can only be seen when signed in:
    - Home ([src/components/Home.tsx](https://github.com/ory/kratos-selfservice-ui-react-native/blob/master/src/components/Home.tsx)) is
    the screen a user sees after login / registration.
    - User Settings ([src/components/Settings.tsx](https://github.com/ory/kratos-selfservice-ui-react-native/blob/master/src/components/Settings.tsx))
    allows the user to update their profile, password, change the email address, and perform other account related actions.
- Can only be seen when not signed in:
    - User Login
    - User Registration
    - Password Recovery / Account Recovery
    - Email / Phone Verification

We'll also generally structure our code so that the entrypoint
[App.tsx](https://github.com/ory/kratos-selfservice-ui-react-native/blob/master/App.tsx)
loads our navigation:

```tsx title="./App.tsx"
IMPORT ME
```



```
npm add url @oryd/kratos-client@0.0.0-next.ed28ab374a8a
```


