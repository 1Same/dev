
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { SafeAreaView, } from 'react-native';
import { Provider } from 'react-redux';
// import { store, persistor } from './src/utils/Store';
// import { store, persistor } from './src/app/Store';
import AppNavigator from './src/navigation/AppNavigation/AppNavigation';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './src/app/Store';

function App(): JSX.Element {

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <SafeAreaView style={{ flex: 1 }}>
          <AppNavigator />
        </SafeAreaView>
      </PersistGate>
    </Provider>
  );
}
export default App;
