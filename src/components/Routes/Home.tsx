import React, { useContext, useEffect } from "react"
import StyledText from "../Styled/StyledText"
import CodeBox from "../Styled/CodeBox"
import { AuthContext } from "../AuthProvider"
import Layout from "../Layout/Layout"
import StyledCard from "../Styled/StyledCard"
import { useNavigation } from "@react-navigation/native"

const Home = () => {
  const navigation = useNavigation()
  const { isAuthenticated, session, sessionToken } = useContext(AuthContext)

  useEffect(() => {
    if (!isAuthenticated || !session) {
      navigation.navigate("Login")
    }
  }, [isAuthenticated, sessionToken])

  if (!isAuthenticated || !session) {
    return null
  }

  const traits = session.identity.traits
  // Use the first name, the email, or the ID as the name
  const first = traits.name?.first || traits.email || session.identity.id

  return (
    <Layout>
      <StyledCard>
        <StyledText style={{ marginBottom: 14 }} variant="h1">
          Welcome back, {first}!
        </StyledText>
        <StyledText variant="lead">
          Hello, nice to have you! You signed up with this data:
        </StyledText>
        <CodeBox>{JSON.stringify(traits || "{}", null, 2)}</CodeBox>
        <StyledText variant="lead">
          You are signed in using an Ory Session Token:
        </StyledText>
        <CodeBox testID="session-token">{sessionToken}</CodeBox>
        <StyledText variant="lead">
          This app makes REST requests to Ory Identities' Public API to validate
          and decode the Ory Session payload:
        </StyledText>
        <CodeBox testID="session-content">
          {JSON.stringify(session || "{}", null, 2)}
        </CodeBox>
      </StyledCard>
    </Layout>
  )
}

export default Home
