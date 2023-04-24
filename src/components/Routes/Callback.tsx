import { RegistrationFlow, UpdateRegistrationFlowBody } from "@ory/client"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { StackScreenProps } from "@react-navigation/stack"
import {
  makeRedirectUri,
  useAuthRequest,
  useAutoDiscovery,
} from "expo-auth-session"
import * as WebBrowser from "expo-web-browser"
import React, { useCallback, useContext, useState } from "react"
import { Linking, Platform } from "react-native"
import { SessionContext } from "../../helpers/auth"
import { getNodeId, handleFormSubmitError } from "../../helpers/form"
import { getIDToken } from "../../helpers/oidc"
import { newOrySdk } from "../../helpers/sdk"
import { AuthContext } from "../AuthProvider"
import AuthLayout from "../Layout/AuthLayout"
import ProjectPicker from "../Layout/ProjectPicker"
import { RootStackParamList } from "../Navigation"
import { SelfServiceFlow } from "../Ory/Ui"
import { ProjectContext } from "../ProjectProvider"
import AuthSubTitle from "../Styled/AuthSubTitle"
import NavigationCard from "../Styled/NavigationCard"
import StyledCard from "../Styled/StyledCard"

type Props = StackScreenProps<RootStackParamList, "Callback">

const Callback = (props: Props) => {
  React.useEffect(() => {
    WebBrowser.maybeCompleteAuthSession({
      skipRedirectCheck: false,
    })
  }, [])
  return (
    <div>
      Hello Callback! Your code is <code>{props.route.params.code}</code>
    </div>
  )
}

export default Callback
