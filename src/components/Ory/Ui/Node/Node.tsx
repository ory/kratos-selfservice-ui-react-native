import {
  instanceOfUiNodeAnchorAttributes,
  instanceOfUiNodeImageAttributes,
  instanceOfUiNodeInputAttributes,
  instanceOfUiNodeTextAttributes,
  UiNode,
} from "@ory/client-fetch"
import React from "react"
import { NodeImage } from "./Image"
import { InputProps, NodeInput } from "./Input"
import { InputSubmitProps, NodeInputSubmit } from "./InputSubmit"
import { NodeText } from "./Text"

interface Props extends InputSubmitProps, InputProps {
  node: UiNode
}

export const Node = (props: Props) => {
  const { node } = props
  if (instanceOfUiNodeImageAttributes(node.attributes)) {
    return <NodeImage node={node} attributes={node.attributes} />
  } else if (instanceOfUiNodeTextAttributes(node.attributes)) {
    return <NodeText node={node} attributes={node.attributes} />
  } else if (instanceOfUiNodeInputAttributes(node.attributes)) {
    if (node.attributes.type === "submit") {
      return <NodeInputSubmit {...props} attributes={node.attributes} />
    }
    return <NodeInput {...props} attributes={node.attributes} />
  } else if (instanceOfUiNodeAnchorAttributes(node.attributes)) {
    // Ignore anchor elements for now.
    // TODO: Implement anchor elements.
    return null
  } else {
    return <>Unknown Element: {node.type}</>
  }
}
