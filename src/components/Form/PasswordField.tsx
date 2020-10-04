import {TextInput} from "react-native";
import React from "react";
import {FormField} from "@oryd/kratos-client";
import {getTitle} from "../../translations";

interface Props {
  field: FormField
  onChange: (value: string) => void
}

const PasswordField = ({field: {name, value}, onChange}: Props) => (
  <TextInput
    value={value ? String(value) : ''}
    onChangeText={onChange}
    autoCompleteType="password"
    textContentType="password"
    secureTextEntry={true}
    placeholder={getTitle(name)}/>
)

export default PasswordField
