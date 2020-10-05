// This file renders the Login screen
import React, { useEffect, useState } from 'react';
import { RootStackParamList } from '../../../App';
import { StackScreenProps } from '@react-navigation/stack';
import { LoginFlow } from '@oryd/kratos-client';
import Form from '../Form/Form';
import kratos, { loginWithPassword } from '../../helpers/sdk';
import StyledCard from '../Styled/StyledCard';
import Layout from '../Layout';
import NavigationCard from '../Styled/NavigationCard';
import AuthSubTitle from '../Styled/AuthSubTitle';
import { CompleteSelfServiceLoginFlowWithPasswordMethod } from '@oryd/kratos-client/api';

type Props = StackScreenProps<RootStackParamList, 'Login'>;

const Login = ({ navigation }: Props) => {
  const [config, setConfig] = useState<LoginFlow | undefined>(undefined);

  // Initializes the login flow.
  useEffect(() => {
    kratos
      .initializeSelfServiceLoginViaAPIFlow()
      .then(({ data: flow }) => {
        setConfig(flow);
      })
      .catch(console.error);
  }, []);

  if (!config) {
    return null;
  }

  const onSubmit = (payload: CompleteSelfServiceLoginFlowWithPasswordMethod) =>
    loginWithPassword<LoginFlow>(
      config.id,
      setConfig
    )(payload).then((session) => {
      navigation.navigate('Home');
      return session;
    });

  return (
    <Layout>
      <StyledCard>
        <AuthSubTitle>Sign in to your LoginApp account</AuthSubTitle>

        <Form
          config={config}
          method="password"
          submitLabel="Sign in"
          onSubmit={onSubmit}
        />
      </StyledCard>

      <NavigationCard
        description="Need an account?"
        cta="Sign up!"
        onPress={() => navigation.navigate('Registration')}
      />
    </Layout>
  );
};

export default Login;
