import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider, useSelector } from 'react-redux';
import { WarningModal } from './src/components/WarningModal/WarningModal';
import { screenSelector } from './src/redux/selectors/administrativeSelector';
import { store } from './src/redux/store';
import { ConfirmScreen } from './src/screens/ConfirmScreen/ConfirmScreen';
import { DiagnosticsScreen } from './src/screens/DiagnosticsScreen/DiagnosticsScreen';
import { HomeScreen } from './src/screens/HomeScreen/HomeScreen';

function AppContent() {
  const isDarkMode = useColorScheme() === 'dark';
  const screen = useSelector(screenSelector);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {screen === 'diagnostics' ? (
        <DiagnosticsScreen />
      ) : screen === 'confirm' ? (
        <ConfirmScreen />
      ) : (
        <HomeScreen />
      )}
      <WarningModal />
    </SafeAreaProvider>
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
