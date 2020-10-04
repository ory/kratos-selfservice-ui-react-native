import {TextInput} from "react-native";
import React from "react";
import {FormField} from "@oryd/kratos-client";
import {getTitle} from "../../translations";

interface Props {
  field: FormField
  onChange: (value: string) => void
}

const EmailField = ({field: {value, name}, onChange}: Props) => (
  <TextInput
    value={value ? String(value) : ''}
    onChangeText={onChange}
    placeholder={getTitle(name)}
    autoCompleteType="username"
    textContentType="username"
  />
)

export default EmailField
