import React, { useContext } from 'react'
import { TouchableHighlight, View } from 'react-native'
import { ThemeContext } from 'styled-components'

import StyledCard from './StyledCard'
import StyledText from './StyledText'

interface Props {
  onPress(): void

  cta: string
  description: string
  testID?: string
}

export default ({ onPress, cta, description, testID }: Props) => {
  const theme = useContext(ThemeContext)
  return (
    <StyledCard>
      <TouchableHighlight testID={testID} onPress={onPress}>
        <View>
          <StyledText variant="h3" style={{ textAlign: 'center' }}>
            {description}{' '}
            <StyledText variant="h3" style={{ color: theme.primary60 }}>
              {cta}
            </StyledText>
          </StyledText>
        </View>
      </TouchableHighlight>
    </StyledCard>
  )
}
