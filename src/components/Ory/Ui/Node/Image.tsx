import React from 'react'
import { UiNode, UiNodeImageAttributes } from '@ory/kratos-client'
import styled from 'styled-components/native'
import { getNodeId } from '../../../../helpers/form'
import { View } from 'react-native'

interface Props {
  node: UiNode
  attributes: UiNodeImageAttributes
}

const StyledImage = styled.Image`
  width: ${({ attributes }: Props) => attributes.width + 'px' || 'auto'};
  height: ${({ attributes }: Props) => attributes.height + 'px' || 'auto'};
`

export const NodeImage = (props: Props) => {
  const name = getNodeId(props.node)
  return (
    <View testID={`field/${name}`}>
      <StyledImage
        {...props}
        source={{
          uri: props.attributes.src
        }}
      />
    </View>
  )
}
