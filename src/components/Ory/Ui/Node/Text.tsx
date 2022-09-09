import React from "react"
import { View } from "react-native"
import { UiNode, UiNodeTextAttributes } from "@ory/kratos-client"
import styled from "styled-components/native"
import {
  textInputTitleStyles,
  typographyLeadStyles,
  typographyParagraphStyles,
} from "@ory/themes"
import StyledText from "../../../Styled/StyledText"
import { getNodeId } from "../../../../helpers/form"

interface Props {
  node: UiNode
  attributes: UiNodeTextAttributes
}

const StyledView = styled.View`
  margin-bottom: 14px;
`

export const NodeText = (props: Props) => {
  const name = getNodeId(props.node)
  return (
    <StyledView testID={`field/${name}`}>
      {props.node.meta.label?.text && (
        <StyledText variant="lead" testID={`field/${name}/label`}>
          {props.node.meta.label?.text}
        </StyledText>
      )}
      <StyledText variant="h3" testID={`field/${name}/text`}>
        {props.attributes.text.text}
      </StyledText>
    </StyledView>
  )
}
