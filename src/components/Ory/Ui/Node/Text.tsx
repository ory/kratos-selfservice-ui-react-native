import { UiNode, UiNodeTextAttributes } from "@ory/client-fetch"
import React from "react"
import styled from "styled-components/native"

import { getNodeId } from "../../../../helpers/form"
import StyledText from "../../../Styled/StyledText"

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
