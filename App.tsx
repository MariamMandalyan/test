import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import useAppBootstrap from './src/App-hook';
import { WarningModal } from './src/components/WarningModal/WarningModal';
import { RootNavigator } from './src/navigation/RootNavigator';
import { rootNavigationRef } from './src/navigation/rootNavigationRef';
import { store } from './src/redux/store';

function AppContent() {
  const isDarkMode = useColorScheme() === 'dark';
  useAppBootstrap();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <NavigationContainer ref={rootNavigationRef}>
          <RootNavigator />
        </NavigationContainer>
        <WarningModal />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
