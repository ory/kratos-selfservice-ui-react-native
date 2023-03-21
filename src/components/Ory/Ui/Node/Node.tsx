import { UiNode } from "@ory/client"
import React from "react"
import {
  isUiNodeAnchorAttributes,
  isUiNodeImageAttributes,
  isUiNodeInputAttributes,
  isUiNodeTextAttributes,
} from "../../../../helpers/form"
import { NodeImage } from "./Image"
import { InputProps, NodeInput } from "./Input"
import { InputSubmitProps, NodeInputSubmit } from "./InputSubmit"
import { NodeText } from "./Text"

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
  } else if (isUiNodeAnchorAttributes(node.attributes)) {
    // Ignore anchor elements for now.
    // TODO: Implement anchor elements.
    return null
  } else {
    return <>Unknown Element: {node.type}</>
  }
}
