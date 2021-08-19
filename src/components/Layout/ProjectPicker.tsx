import { View } from 'react-native'
import StyledTextInput from '../Styled/StyledTextInput'
import React, { useContext, useState } from 'react'
import styled from 'styled-components/native'
import { ThemeContext } from 'styled-components'
import { textInputSubtitleStyles, textInputTitleStyles } from '@ory/themes'
import * as Linking from 'expo-linking'

import StyledCard from '../Styled/StyledCard'
import StyledText from '../Styled/StyledText'
import { ProjectContext } from '../ProjectProvider'

const Subtitle = styled.Text(textInputSubtitleStyles)

const open = (href: string) => () => {
  Linking.openURL(href)
}

const ProjectPicker = () => {
  const { project, setProject } = useContext(ProjectContext)
  const [inner, setInner] = useState(project)
  const theme = useContext(ThemeContext)

  return (
    <StyledCard>
      <View testID={`field/project`}>
        <StyledTextInput
          testID="project-selector"
          value={inner}
          onChangeText={setInner}
          onEndEditing={() => {
            setProject(inner)
          }}
        />
        <Subtitle>
          Currently using project "{project}". Type your project slug here to
          use this app with your project. You do not have a Ory Project yet?{' '}
          <StyledText
            style={{ color: theme.primary60 }}
            onPress={open('https://console.ory.sh/')}
          >
            Create one for free!
          </StyledText>
        </Subtitle>
      </View>
    </StyledCard>
  )
}

export default ProjectPicker
