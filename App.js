import React, {useEffect, useState} from 'react';
import Navigation from './app/navigation';
import {Provider} from 'react-redux';
import {store, persistor} from './app/redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import {TouchableOpacity, View} from 'react-native';
import Toast from 'react-native-toast-message';
import Text from './app/components/text';
import * as colors from './app/styles/colors';
import {MI} from './app/assets/icons';

const toastConfig = {
  success: ({text1, props, ...rest}) => (
    <View
      style={{
        height: 54,
        width: '100%',
        backgroundColor: '#28a745',
        paddingHorizontal: 20,
        justifyContent: 'center',
      }}>
      <Text style={{color: '#fff'}}>{text1}</Text>
    </View>
  ),
  error: ({text1, props, ...rest}) => (
    <View
      style={{
        height: 54,
        width: '100%',
        backgroundColor: '#dc3545',
        paddingHorizontal: 20,
        justifyContent: 'center',
      }}>
      <Text style={{color: '#fff'}}>{text1}</Text>
    </View>
  ),
  info: ({text1, props, ...rest}) => (
    <View
      style={{
        height: 54,
        width: '100%',
        backgroundColor: '#17a2b8',
        paddingHorizontal: 20,
        justifyContent: 'center',
      }}>
      <Text style={{color: '#fff'}}>{text1}</Text>
    </View>
  ),
  warning: ({text1, props, ...rest}) => (
    <View
      style={{
        height: 54,
        width: '100%',
        backgroundColor: '#ffc107',
        paddingHorizontal: 20,
        justifyContent: 'center',
      }}>
      <Text style={{color: '#fafafa'}}>{text1}</Text>
    </View>
  ),
  notif: ({text1, text2, onPress, props, ...rest}) => (
    <View
      style={{
        width: '95%',
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        justifyContent: 'center',
        shadowColor: colors.darkGrey,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        borderRadius: 10,
        elevation: 5,
        borderWidth: 0.6,
        borderColor: colors.grey,
        paddingVertical: 12,
      }}>
      <TouchableOpacity
        style={{flexDirection: 'row', alignItems: 'center'}}
        onPress={onPress}>
        <View style={{flexDirection: 'row', alignItems: 'center', flex: 5.4}}>
          <View style={{marginRight: 10}}>
            <MI name={'notifications-on'} size={30} color={colors.primary} />
          </View>
          <View style={{flex: 1}}>
            <Text bold size={16} style={{color: '#000'}}>
              {text1}
            </Text>
            <Text style={{color: '#000', marginTop: 3}}>{text2}</Text>
          </View>
        </View>
        <View>
          <MI name={'chevron-right'} size={30} color={colors.darkGrey} />
        </View>
      </TouchableOpacity>
    </View>
  ),
};

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Navigation />
        <Toast ref={ref => Toast.setRef(ref)} config={toastConfig} />
      </PersistGate>
    </Provider>
  );
};

export default App;
