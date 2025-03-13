import React, { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView, StyleSheet, Platform, StatusBar } from 'react-native';
import Navigation from './src/navigation/Navigation';
import SplashScreen from './src/screens/Splash/SplashScreen';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleSplashFinish = () => {
    setIsLoading(false);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        {isLoading ? (
          <SplashScreen onFinish={handleSplashFinish} />
        ) : (
          <Navigation />
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: Platform.OS === 'android' ? StatusBar.currentHeight-30 : 0,
  },
});

export default App;
