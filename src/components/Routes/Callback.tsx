import { StackScreenProps } from "@react-navigation/stack"
import * as WebBrowser from "expo-web-browser"
import React from "react"
import { RootStackParamList } from "../Navigation"

type Props = StackScreenProps<RootStackParamList, "Callback">

const Callback = (props: Props) => {
  React.useEffect(() => {
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
