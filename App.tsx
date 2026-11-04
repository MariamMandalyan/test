import React, { useState } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DiagnosticsScreen } from './src/screens/DiagnosticsScreen/DiagnosticsScreen';
import { HomeScreen } from './src/screens/HomeScreen/HomeScreen';

type ScreenName = 'home' | 'diagnostics';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [screen, setScreen] = useState<ScreenName>('home');

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {screen === 'diagnostics' ? (
        <DiagnosticsScreen onBack={() => setScreen('home')} />
      ) : (
        <HomeScreen onOpenDiagnostics={() => setScreen('diagnostics')} />
      )}
    </SafeAreaProvider>
  );
}

export default App;
