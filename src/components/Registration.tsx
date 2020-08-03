import React from 'react';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import {RootStackParamList} from "../../App";
import {StackScreenProps} from "@react-navigation/stack";

type Props = StackScreenProps<RootStackParamList, "Registration">

const Registration = ({navigation}: Props) => (
    <View style={styles.container}>
      <Text>Registration</Text>

      <TextInput placeholder={"Email"} textContentType="username" />
      <TextInput autoCompleteType="password" placeholder="Password" textContentType="newPassword"/>

      <Button
        title="Sign In"
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  )

export default Registration

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
