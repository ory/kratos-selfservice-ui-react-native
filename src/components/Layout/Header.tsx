import React, { useContext } from 'react'
import { TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'
import { ThemeProps } from '@ory/themes'
import { useNavigation } from '@react-navigation/native'
import { AuthContext } from '../AuthProvider'

const Buttons = styled.View`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`

const StyledImage = styled.Image`
  width: 110px;
  height: 26px;
`

const HeaderButton = styled.Image`
  height: 16px;
  width: 16px;
  margin-left: 16px;
`

const Container = styled.View`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;

  margin: 0 auto;

  padding: 20px;
  width: 100%;

  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }: ThemeProps) => theme.primary60};
  background-color: ${({ theme }) => theme.grey5};
`

const Header = () => {
  const navigation = useNavigation()
  const { setSession } = useContext(AuthContext)
  const logout = () => setSession(null)
  const navigate = (to: 'Settings' | 'Home') => () => {
    navigation.navigate(to)
  }

  return (
    <Container>
      <TouchableOpacity onPress={navigate('Home')}>
        <StyledImage
          resizeMode="contain"
          source={require('../../assets/logo.png')}
        />
      </TouchableOpacity>
      <Buttons>
        <TouchableOpacity onPress={navigate('Settings')}>
          <HeaderButton
            resizeMode="contain"
            source={require('../../assets/gear.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity testID={'logout'} onPress={logout}>
          <HeaderButton
            resizeMode="contain"
            source={require('../../assets/sign-out.png')}
          />
        </TouchableOpacity>
      </Buttons>
    </Container>
  )
}

export default Header
