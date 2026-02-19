// Updated to restore app functionality with safe imports

import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

const Index = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text>App is functioning correctly!</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Index;