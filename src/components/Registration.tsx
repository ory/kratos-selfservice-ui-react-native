import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { RootStackParamList } from '../../App';
import { StackScreenProps } from '@react-navigation/stack';
import { RegistrationFlow } from '@oryd/kratos-client';
import Form from './Form/Form';
import kratos, { registrationWithPassword } from '../helpers/sdk';
import StyledCard from './Styled/StyledCard';
import NavigationCard from './Styled/NavigationCard';
import Layout from './Layout';
import AuthSubTitle from './Styled/AuthSubTitle';

type Props = StackScreenProps<RootStackParamList, 'Registration'>;

const Registration = ({ navigation }: Props) => {
  const [config, setConfig] = useState<RegistrationFlow | undefined>(undefined);

  useEffect(() => {
    kratos
      .initializeSelfServiceRegistrationViaAPIFlow()
      .then(({ data: flow }) => {
        setConfig(flow);
      })
      .catch(console.error);
  }, []);

  if (!config) {
    return null;
  }

  const onSubmit = (payload: Object) =>
    registrationWithPassword(
      config.id,
      setConfig
    )(payload).then((session) => {
      navigation.navigate('Home');
      return session;
    });

  return (
    <Layout>
      <StyledCard>
        <AuthSubTitle>Create your LoginApp account</AuthSubTitle>

        <Form
          config={config}
          method="password"
          submitLabel="Sign up"
          onSubmit={onSubmit}
        />
      </StyledCard>

      <NavigationCard
        description="Already have an account?"
        cta="Sign in!"
        onPress={() => navigation.navigate('Login')}
      />
    </Layout>
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
