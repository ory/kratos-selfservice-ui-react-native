import { UiNode, UiNodeInputAttributes } from "@ory/client-fetch"
import React from "react"
import { ActivityIndicator, View } from "react-native"
import { showMessage } from "react-native-flash-message"
import styled from "styled-components/native"
import {
  isPasskeySupported,
  parseRegistrationOptions,
  parseLoginOptions,
  performRegistration,
  performLogin,
  parsePasskeyError,
  PasskeyErrorType,
} from "../../../../helpers/passkey"
import Button from "../../../Styled/StyledButton"
import StyledText from "../../../Styled/StyledText"

const PasskeyContainer = styled.View`
  margin-top: 8px;
`

const PasskeyItem = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  margin-bottom: 8px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-width: 1px;
  border-color: #dee2e6;
`

const PasskeyInfo = styled.View`
  flex: 1;
  margin-right: 12px;
`

interface NodePasskeyProps {
  nodes: UiNode[]
  onSubmit: (payload: Record<string, any>) => void
  disabled: boolean
}

interface PasskeyDetails {
  id: string
  displayName: string
  addedAt: string
  node: UiNode
}

export const NodePasskey = ({ nodes, onSubmit, disabled }: NodePasskeyProps) => {
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [removingPasskeyId, setRemovingPasskeyId] = React.useState<
    string | null
  >(null)
  const [isSupported, setIsSupported] = React.useState<boolean | null>(null)

  React.useEffect(() => {
    isPasskeySupported().then(setIsSupported)
  }, [])

  const nodeData = React.useMemo(() => {
    let createData: string | null = null
    let challenge: string | null = null
    let registerTrigger: UiNode | null = null
    let loginTrigger: UiNode | null = null
    let isSettingsFlow = false
    const existingPasskeys: PasskeyDetails[] = []

    for (const node of nodes) {
      if (node.type !== "input") continue
      const attrs = node.attributes as UiNodeInputAttributes

      switch (attrs.name) {
        case "passkey_create_data":
          createData = attrs.value as string
          break
        case "passkey_challenge":
          challenge = attrs.value as string
          break
        case "passkey_register_trigger":
          registerTrigger = node
          break
        case "passkey_login_trigger":
          loginTrigger = node
          break
        case "passkey_settings_register":
          isSettingsFlow = true
          break
        case "passkey_remove": {
          const context = node.meta?.label?.context as
            | {
                display_name?: string
                added_at?: string
              }
            | undefined
          existingPasskeys.push({
            id: attrs.value as string,
            displayName: context?.display_name || "Passkey",
            addedAt: context?.added_at || "",
            node,
          })
          break
        }
      }
    }

    const isRegistration =
      createData !== null && registerTrigger !== null && !isSettingsFlow
    const isLogin = challenge !== null && loginTrigger !== null

    return {
      createData,
      challenge,
      registerTrigger,
      loginTrigger,
      isRegistration,
      isLogin,
      isSettingsFlow,
      existingPasskeys,
      triggerNode: registerTrigger || loginTrigger,
    }
  }, [nodes])

  const handlePasskeyPress = React.useCallback(async () => {
    setIsProcessing(true)

    try {
      if (nodeData.createData) {
        const options = parseRegistrationOptions(nodeData.createData)
        const credentialResponse = await performRegistration(options)

        if (nodeData.isSettingsFlow) {
          onSubmit({
            passkey_settings_register: credentialResponse,
            method: "passkey",
          })
        } else {
          onSubmit({
            passkey_register: credentialResponse,
            method: "passkey",
          })
        }
      } else if (nodeData.isLogin && nodeData.challenge) {
        const options = parseLoginOptions(nodeData.challenge)
        const credentialResponse = await performLogin(options)

        onSubmit({
          passkey_login: credentialResponse,
          method: "passkey",
        })
      }
    } catch (err) {
      const passkeyError = parsePasskeyError(err)

      if (passkeyError.type !== PasskeyErrorType.Cancelled) {
        showMessage({
          message: passkeyError.message,
          type: "danger",
        })
      }

      if (__DEV__) {
        console.error("Passkey error:", err)
      }
    } finally {
      setIsProcessing(false)
    }
  }, [nodeData, onSubmit])

  const handleRemovePasskey = React.useCallback(
    (passkeyId: string) => {
      setRemovingPasskeyId(passkeyId)
      onSubmit({
        passkey_remove: passkeyId,
      })
    },
    [onSubmit],
  )

  if (isSupported === false || isSupported === null) {
    return null
  }

  const hasContent =
    nodeData.triggerNode || nodeData.existingPasskeys.length > 0
  if (!hasContent) {
    return null
  }

  const buttonLabel =
    nodeData.triggerNode?.meta.label?.text ||
    (nodeData.isSettingsFlow
      ? "Add passkey"
      : nodeData.isRegistration
        ? "Sign up with passkey"
        : "Sign in with passkey")

  const isDisabled = disabled || isProcessing

  return (
    <PasskeyContainer>
      {nodeData.existingPasskeys.length > 0 && (
        <View>
          <StyledText variant="caption">Registered passkeys</StyledText>
          {nodeData.existingPasskeys.map((passkey) => {
            const attrs = passkey.node.attributes as UiNodeInputAttributes
            const isNodeDisabled = attrs.disabled || disabled
            const isRemoving = removingPasskeyId === passkey.id

            return (
              <PasskeyItem key={passkey.id}>
                <PasskeyInfo>
                  <StyledText>{passkey.displayName}</StyledText>
                  {passkey.addedAt ? (
                    <StyledText variant="caption">
                      Added{" "}
                      {new Date(passkey.addedAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </StyledText>
                  ) : null}
                </PasskeyInfo>
                {isRemoving ? (
                  <ActivityIndicator size="small" />
                ) : (
                  <Button
                    testID={`passkey-remove-${passkey.id}`}
                    title="Remove"
                    disabled={isNodeDisabled}
                    onPress={() => handleRemovePasskey(passkey.id)}
                  />
                )}
              </PasskeyItem>
            )
          })}
        </View>
      )}

      {nodeData.triggerNode && (
        <View testID="passkey-trigger">
          {isProcessing ? (
            <ActivityIndicator size="small" />
          ) : (
            <Button
              testID="passkey-button"
              title={buttonLabel}
              disabled={isDisabled}
              onPress={handlePasskeyPress}
            />
          )}
        </View>
      )}

      {nodeData.triggerNode?.messages?.map((msg, index) => (
        <StyledText
          key={msg.id ?? index}
          variant="caption"
          style={msg.type === "error" ? { color: "red" } : undefined}
        >
          {msg.text}
        </StyledText>
      ))}
    </PasskeyContainer>
  )
}
