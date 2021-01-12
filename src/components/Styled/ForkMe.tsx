import React from 'react'
import styled from 'styled-components/native'
import {
  forkMeStyles,
  forkMeStylesFork,
  forkMeStylesImages,
  forkMeStylesLink,
  forkMeStylesText
} from '@ory/themes'
import * as Linking from 'expo-linking'

const Container = styled.View(forkMeStyles)
const StyledImage = styled.Image(forkMeStylesImages)
const Fork = styled.Image(forkMeStylesFork)
const Link = styled.Text(forkMeStylesLink)
const StyledText = styled.Text`
  ${forkMeStylesText}
  display: flex;
`

const fork = () => Linking.openURL('https://github.com/ory')

export default () => (
  <Container>
    <StyledImage
      resizeMode="contain"
      source={require('../../assets/ory.png')}
    />
    <StyledText>
      Fork me on{' '}
      <Link onPress={fork}>
        <Fork
          resizeMode="contain"
          source={require('../../assets/repo-forked.png')}
        />
        GitHub!
      </Link>
    </StyledText>
  </Container>
)
