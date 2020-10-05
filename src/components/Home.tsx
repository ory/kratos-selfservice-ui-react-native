import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { killAuthenticatedSession } from '../helpers/auth';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

const Home = ({ navigation }: Props) => (
  <View style={styles.container}>
    <Text>Welcome asdf home!</Text>
    <Button
      title={'Logout'}
      onPress={() => {
        killAuthenticatedSession().then(() => {
          navigation.navigate('Login');
        });
      }}
    />
  </View>
);

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
