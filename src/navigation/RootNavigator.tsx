import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ConfirmScreen } from '../screens/ConfirmScreen/ConfirmScreen';
import { DetailScreen } from '../screens/DetailScreen/DetailScreen';
import { DiagnosticsScreen } from '../screens/DiagnosticsScreen/DiagnosticsScreen';
import { HomeScreen } from '../screens/HomeScreen/HomeScreen';
import { ResultScreen } from '../screens/ResultScreen/ResultScreen';
import { StatusScreen } from '../screens/StatusScreen/StatusScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Confirm" component={ConfirmScreen} />
      <Stack.Screen name="Status" component={StatusScreen} />
      <Stack.Screen name="Result" component={ResultScreen} />
      <Stack.Screen name="Detail" component={DetailScreen} />
      <Stack.Screen name="Diagnostics" component={DiagnosticsScreen} />
    </Stack.Navigator>
  );
}
