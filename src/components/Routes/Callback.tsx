import { StackScreenProps } from "@react-navigation/stack"
import * as WebBrowser from "expo-web-browser"
import React, { useEffect } from "react"
import { RootStackParamList } from "../Navigation"

type Props = StackScreenProps<RootStackParamList, "Callback">

// This is the route that the user is redirected to after they have logged in with their OIDC (SSO) account.
// It will handle the completion of the auth request
const Callback = (props: Props) => {
  useEffect(() => {
    WebBrowser.maybeCompleteAuthSession({
      skipRedirectCheck: false,
    })
  }, [])
  return (
    <div>
      {props.route.params?.code ? (
        <>
          Hello Callback! Your code is <code>{props.route.params?.code}</code>
        </>
      ) : (
        <>
          Missing query parameter <code>?code=...</code>
        </>
      )}
    </div>
  )
}

export default Callback
