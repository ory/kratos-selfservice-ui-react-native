import {
  instanceOfUiNodeInputAttributes,
  LoginFlow,
  RegistrationFlow,
  SettingsFlow,
  UiNode,
  UpdateLoginFlowBody,
  UpdateRegistrationFlowBody,
  UpdateSettingsFlowBody,
  UpdateVerificationFlowBody,
  VerificationFlow,
} from "@ory/client-fetch"
import React, { useLayoutEffect, useState } from "react"
import { getNodeId } from "../../../helpers/form"
import Messages from "./Messages"
import { Node, TextInputOverride } from "./Node"
import { NodePasskey } from "./Node/Passkey"

// Convert flat dot-notation keys to nested objects
// e.g., {"traits.email": "x", "traits.name.first": "y"} => {traits: {email: "x", name: {first: "y"}}}
function unflattenObject(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {}
  for (const key in obj) {
    const keys = key.split(".")
    let current = result
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i]
      if (!(k in current)) {
        current[k] = {}
      }
      current = current[k]
    }
    current[keys[keys.length - 1]] = obj[key]
  }
  return result
}

interface Props<T> {
  flow?: LoginFlow | RegistrationFlow | SettingsFlow | VerificationFlow
  onSubmit: (payload: T) => Promise<void>
  only?: "password" | "profile" | "totp" | "lookup_secret" | "passkey"
  textInputOverride?: TextInputOverride
}

export const SelfServiceFlow = <
  T extends
    | UpdateSettingsFlowBody
    | UpdateLoginFlowBody
    | UpdateRegistrationFlowBody
    | UpdateVerificationFlowBody,
>({
  flow,
  only,
  onSubmit,
  textInputOverride,
}: Props<T>) => {
  const [inProgress, setInProgress] = useState(false)
  const [values, setValues] = useState<T>({} as T)
  const [nodes, setNodes] = useState<Array<UiNode>>([])
  const [passkeyNodes, setPasskeyNodes] = useState<Array<UiNode>>([])

  useLayoutEffect(() => {
    if (!flow) {
      return
    }

    const filtered = flow.ui.nodes.filter(({ group }) => {
      if (only) {
        return group === only || group === "default"
      }
      return true
    })

    // Separate passkey nodes — they are rendered by NodePasskey instead
    // of the generic Node component.
    const passkey = filtered.filter((n) => n.group === "passkey")
    const nonPasskey = only === "passkey"
      ? filtered.filter((n) => n.group === "default")
      : filtered.filter((n) => n.group !== "passkey")

    const values: Partial<T> = {}
    // Extract initial values from all filtered nodes (including passkey hidden
    // fields like csrf_token from the default group).
    filtered.forEach((node: UiNode) => {
      const name = getNodeId(node)

      const key = name as keyof T
      if (instanceOfUiNodeInputAttributes(node.attributes)) {
        if (
          node.attributes.type === "button" ||
          node.attributes.type === "submit"
        ) {
          // In order to mimic real HTML forms, we need to skip setting the value
          // for buttons as the button value will (in normal HTML forms) only trigger
          // if the user clicks it.
          return
        }
        values[key] = node.attributes.value
      }
    })

    setValues(values as T)
    setNodes(nonPasskey)
    setPasskeyNodes(passkey)
  }, [flow])

  if (!flow) {
    return null
  }

  const onChange = (name: string) => (value: any) => {
    setValues((values) => ({
      ...values,
      [name]: value,
    }))
  }

  // Passkey submit handler: merges hidden field values (e.g. csrf_token)
  // with the credential response from the passkey ceremony.
  const onPasskeySubmit = (passkeyValues: Record<string, any>) => {
    const flatPayload: Record<string, any> = { ...values, ...passkeyValues }
    const payload = unflattenObject(flatPayload) as T
    setInProgress(true)
    onSubmit(payload)
      .then(() => setInProgress(false))
      .catch(() => setInProgress(false))
  }

  const getValue = (name: string) => values[name as keyof T]
  const onPress = (key: string, value: any) => {
    const flatPayload: Record<string, any> = { ...values, [key]: value }

    // Derive the correct "method" from the clicked button's group. The fetch
    // SDK uses a discriminated union on "method" and strips fields that don't
    // belong to the matched variant. For example, clicking the "screen"
    // button (group "profile") must send method "profile" so the SDK
    // serializer includes the "screen" field. If the hidden method input's
    // value (e.g. "code") were used instead, the SDK would serialize as the
    // code variant and drop the "screen" field entirely.
    if (key !== "method") {
      const clickedNode = nodes.find(
        (n) =>
          instanceOfUiNodeInputAttributes(n.attributes) &&
          n.attributes.name === key &&
          n.attributes.type === "submit",
      )
      if (clickedNode && clickedNode.group !== "default") {
        flatPayload["method"] = clickedNode.group
      } else if (only) {
        flatPayload["method"] = only
      } else if (!("method" in flatPayload)) {
        // Last resort: look for a method node (only one group present)
        const methodNode = nodes.find(
          (n) =>
            instanceOfUiNodeInputAttributes(n.attributes) &&
            n.attributes.name === "method" &&
            (n.attributes.type === "submit" || n.attributes.type === "hidden"),
        )
        if (
          methodNode &&
          instanceOfUiNodeInputAttributes(methodNode.attributes) &&
          methodNode.attributes.value
        ) {
          flatPayload["method"] = methodNode.attributes.value
        }
      }
    }

    const payload = unflattenObject(flatPayload) as T
    setInProgress(true)
    onSubmit(payload)
      .then(() => {
        setInProgress(false)
      })
      .catch(() => {
        setInProgress(false)
      })
  }

  return (
    <>
      <Messages testID="form-messages" messages={flow.ui.messages} />
      {nodes.map((node: UiNode, k) => {
        const name = getNodeId(node)
        return (
          <Node
            key={`form-field-${flow.ui.action || ""}-${name}-${k}`}
            textInputOverride={textInputOverride}
            disabled={inProgress}
            value={getValue(name)}
            onChange={onChange(name)}
            node={node}
            isSubmitting={inProgress}
            onSubmitPress={onPress}
          />
        )
      })}
      {passkeyNodes.length > 0 && (
        <NodePasskey
          nodes={passkeyNodes}
          onSubmit={onPasskeySubmit}
          disabled={inProgress}
        />
      )}
    </>
  )
}
