// This file renders the Login screen
import React, { useContext, useEffect, useState } from 'react';
import { RootStackParamList } from '../../App';
import { StackScreenProps } from '@react-navigation/stack';
import { LoginFlow } from '@oryd/kratos-client';
import Form from './Form/Form';
import { handleFormSubmitError, methodConfig } from '../helpers/form';
import { setAuthenticatedSession } from '../helpers/auth';
import kratos from '../helpers/sdk';
import Button from './Styled/StyledButton';
import Layout from './Layout';
import { CompleteSelfServiceLoginFlowWithPasswordMethod } from '@oryd/kratos-client/api';
import StyledText from './Styled/StyledText';
import { ThemeContext } from 'styled-components/native';
import StyledCard from './Styled/StyledCard';
import { TouchableHighlight, TouchableOpacity, View } from 'react-native';

type Props = StackScreenProps<RootStackParamList, 'Login'>;

const Login = ({ navigation }: Props) => {
  const [config, setConfig] = useState<LoginFlow | undefined>(undefined);
  const theme = useContext(ThemeContext);

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

  const loginPassword = (
    body: CompleteSelfServiceLoginFlowWithPasswordMethod
  ) => {
    kratos
      .completeSelfServiceLoginFlowWithPasswordMethod(config.id, body)
      .then(({ data }) => {
        return setAuthenticatedSession(data);
      })
      .catch(handleFormSubmitError(setConfig));
  };

  const passwordMethod = methodConfig(config, 'password');
  return (
    <Layout>
      <StyledCard>
        <StyledText
          variant="h2"
          style={{
            color: theme.primary60,
            marginBottom: 15,
          }}
        >
          Sign in to your LoginApp account
        </StyledText>

        {passwordMethod && (
          <Form
            config={passwordMethod}
            submitLabel="Sign in"
            onSubmit={loginPassword}
          />
        )}
      </StyledCard>

      <StyledCard>
        <TouchableHighlight onPress={() => navigation.navigate('Registration')}>
          <View>
            <StyledText variant="h3" style={{ textAlign: 'center' }}>
              Need an account?{' '}
              <StyledText variant="h3" style={{ color: theme.primary60 }}>
                Sign up!
              </StyledText>
            </StyledText>
          </View>
        </TouchableHighlight>
      </StyledCard>
    </Layout>
  );
};

export default Login;
