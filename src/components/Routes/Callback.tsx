import { StackScreenProps } from "@react-navigation/stack"
import * as WebBrowser from "expo-web-browser"
import React, { useEffect } from "react"
import { View, Text } from "react-native"
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
    <View>
      {props.route.params?.code ? (
        <Text>
          Hello Callback! Your code is <Text style={{ fontFamily: "monospace" }}>{props.route.params?.code}</Text>
        </Text>
      ) : (
        <Text>
          Missing query parameter <Text style={{ fontFamily: "monospace" }}>?code=...</Text>
        </Text>
      )}
    </View>
  )
}

export default Callback
