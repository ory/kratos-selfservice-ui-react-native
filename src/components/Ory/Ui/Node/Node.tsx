import { UiNode } from "@ory/kratos-client"
import React from "react"
import {
  isUiNodeImageAttributes,
  isUiNodeInputAttributes,
  isUiNodeTextAttributes,
} from "../../../../helpers/form"
import { NodeImage } from "./Image"
import { NodeText } from "./Text"
import { InputProps, NodeInput } from "./Input"
import { InputSubmitProps, NodeInputSubmit } from "./InputSubmit"

interface Props extends InputSubmitProps, InputProps {
  node: UiNode
}

export const Node = (props: Props) => {
  const { node } = props
  if (isUiNodeImageAttributes(node.attributes)) {
    return <NodeImage node={node} attributes={node.attributes} />
  } else if (isUiNodeTextAttributes(node.attributes)) {
    return <NodeText node={node} attributes={node.attributes} />
  } else if (isUiNodeInputAttributes(node.attributes)) {
    if (node.attributes.type === "submit") {
      return <NodeInputSubmit {...props} attributes={node.attributes} />
    }
    return <NodeInput {...props} attributes={node.attributes} />
  } else {
    return <>Unknown Element: {node.type}</>
  }
}
