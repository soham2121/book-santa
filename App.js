import React from 'react';
import { StyleSheet } from 'react-native';
import LoginPage from './screens/LoginPage';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { AppTabNavigator } from './components/Apptabnavigator';
import { AppDrawerNavigator } from './components/AppDrawerNavigator';

export default function App() {
  return (
    <AppContainer/>
  );
}

const switchnavigator = createSwitchNavigator({
  loginscreen: {screen: LoginPage},
  drawer: {screen: AppDrawerNavigator}
});

const AppContainer = createAppContainer(switchnavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
