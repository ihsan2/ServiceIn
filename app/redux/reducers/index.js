import {combineReducers} from 'redux';
import {persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userState from './userReducer';
import orderState from './orderReducer';

const userConfig = {
  key: 'user',
  storage: AsyncStorage,
  whitelist: ['users', 'role', 'user', 'listUser'],
};
const orderConfig = {
  key: 'order',
  storage: AsyncStorage,
  whitelist: ['orders', 'orders_tek'],
};

const rootReducer = combineReducers({
  userState: persistReducer(userConfig, userState),
  orderState: persistReducer(orderConfig, orderState),
});

export default rootReducer;
