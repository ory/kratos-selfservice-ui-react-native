import React, { useContext } from 'react'
import StyledText from '../Styled/StyledText'
import CodeBox from '../Styled/CodeBox'
import { AuthContext } from '../AuthProvider'
import Layout from '../Layout/Layout'
import StyledCard from '../Styled/StyledCard'

const Home = () => {
  const { session, sessionToken } = useContext(AuthContext)
  if (!session) {
    return null
  }

  const email =
    (session.identity.traits as any).email || String(session.identity.id)

  return (
    <Layout>
      <StyledCard>
        <StyledText style={{ marginBottom: 14 }} variant="h1">
          Welcome back, {email}!
        </StyledText>
        <StyledText variant="lead">
          Hello, nice to have you! You signed up with this data:
        </StyledText>
        <CodeBox>
          {JSON.stringify(session.identity.traits || '{}', null, 2)}
        </CodeBox>
        <StyledText variant="lead">
          You are signed in using an ORY Kratos Session Token:
        </StyledText>
        <CodeBox testID="session-token">{sessionToken}</CodeBox>
        <StyledText variant="lead">
          This app makes REST requests to ORY Kratos' Public API to validate and
          decode the ORY Kratos Session payload:
        </StyledText>
        <CodeBox testID="session-content">
          {JSON.stringify(session || '{}', null, 2)}
        </CodeBox>
      </StyledCard>
    </Layout>
  )
}

export default Home
