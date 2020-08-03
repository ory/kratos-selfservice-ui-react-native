import React from 'react';
import { StyleSheet, Text, View} from 'react-native';

const Home = () =>  (
  <View style={styles.container}>
    <Text>Welcome home!</Text>
  </View>
)

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
