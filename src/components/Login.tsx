// This file renders the Login screen
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../../App';
import { StackScreenProps } from '@react-navigation/stack';
import { FormField, LoginFlow } from '@oryd/kratos-client';
import Form from './Form/Form';
import { fieldsToProto, methodConfig } from '../helpers/form';
import { AxiosError } from 'axios';
import { setAuthenticatedSession } from '../helpers/auth';
import kratos from '../helpers/sdk';

type Props = StackScreenProps<RootStackParamList, 'Login'>

const Login = ({ navigation }: Props) => {
  const [config, setConfig] = useState<LoginFlow | undefined>(undefined);

  // Initializes the login flow.
  useEffect(() => {
    kratos.initializeSelfServiceLoginViaAPIFlow().then(({ data: flow }) => {
      setConfig(flow);
    });
  }, []);

  if (!config) {
    return null;
  }

  const loginPassword = (fields: Array<FormField>) => {
    const keys = fieldsToProto({ password: '', identifier: '' }, fields);

    kratos
      .completeSelfServiceLoginFlowWithPasswordMethod(config.id, keys.identifier, keys.password)
      .then(({ data }) => {
        return setAuthenticatedSession(data);
      }).catch((err: AxiosError) => {
      if (err.response?.status === 400) {
        console.log(err.response.data);
        setConfig(err.response.data);
        return;
      }

      console.error(err, err.response?.data);
      return;
    });
  };

  const passwordMethod = methodConfig(config, 'password');
  return (
    <View style={styles.container}>
      <Text>Login</Text>

      {passwordMethod && (
        <Form config={passwordMethod}
              submitLabel="Sign in"
              onSubmit={loginPassword} />)}

      <Button
        title="Sign Up"
        onPress={() => navigation.navigate('Registration')}
      />
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
