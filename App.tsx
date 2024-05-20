import 'react-native-gesture-handler';
import React from 'react';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs(true);

import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './src/helpNavigation/NavigationConfig';

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};

export default App;
