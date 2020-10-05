import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { RootStackParamList } from '../../App';
import { StackScreenProps } from '@react-navigation/stack';
import {
  fieldsToKeyMap,
  handleFormSubmitError,
  methodConfig,
} from '../helpers/form';
import { FormField, RegistrationFlow } from '@oryd/kratos-client';
import Form from './Form/Form';
import { setAuthenticatedSession } from '../helpers/auth';
import kratos from '../helpers/sdk';

type Props = StackScreenProps<RootStackParamList, 'Registration'>;

const Registration = ({ navigation }: Props) => {
  const [config, setConfig] = useState<RegistrationFlow | undefined>(undefined);

  useEffect(() => {
    kratos
      .initializeSelfServiceRegistrationViaAPIFlow()
      .then(({ data: flow }) => {
        setConfig(flow);
      });
  }, []);

  if (!config) {
    return null;
  }

  const registrationPassword = (fields: Array<FormField>) => {
    kratos
      .completeSelfServiceRegistrationFlowWithPasswordMethod(
        config.id,
        fieldsToKeyMap(fields)
      )
      .then(({ data }) => {
        if (!data.sessionToken) {
          navigation.navigate('Login');
          return;
        }

        return setAuthenticatedSession(data);
      })
      .catch(handleFormSubmitError);
  };

  const passwordMethod = methodConfig(config, 'password');
  return (
    <View style={styles.container}>
      <Text>Registration</Text>

      {passwordMethod && (
        <Form
          config={passwordMethod}
          submitLabel="Sign Up"
          onSubmit={registrationPassword}
        />
      )}

      <Button title="Sign In" onPress={() => navigation.navigate('Login')} />
    </View>
  );
};

export default Registration;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
