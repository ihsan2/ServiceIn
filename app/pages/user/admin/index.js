import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

import HomePage from './home';
import ProfilePage from './profile';
import {View} from 'react-native';
import {MCI} from '../../../assets/icons';
import Text from '../../../components/text';
import * as colors from '../../../styles/colors';
import {useDispatch, useSelector} from 'react-redux';
import {getUser} from '../../../redux/actions/user';

const HomeUser = ({navigation}) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.userState.user);

  useEffect(() => {
    dispatch(getUser(user.uid));
  }, []);

  return (
    <Tab.Navigator tabBarOptions={{style: {height: 54}}}>
      <Tab.Screen
        name="Home"
        component={HomePage}
        options={{
          title: 'Home',
          tabBarIcon: ({focused}) => (
            <IconTab ic={'home'} cl={focused ? colors.primary : colors.grey} />
          ),
          tabBarLabel: ({focused}) => (
            <LabelTab tx={'Home'} cl={focused ? colors.primary : colors.grey} />
          ),
        }}
      />
      <Tab.Screen
        name="Akun"
        component={ProfilePage}
        options={{
          title: 'Akun',
          tabBarIcon: ({focused}) => (
            <IconTab
              ic={'account'}
              cl={focused ? colors.primary : colors.grey}
            />
          ),
          tabBarLabel: ({focused}) => (
            <LabelTab tx={'Akun'} cl={focused ? colors.primary : colors.grey} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default HomeUser;

const IconTab = ({ic, cl}) => {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: cl,
        width: 30,
        height: 30,
        borderRadius: 30 / 2,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <MCI name={ic} color={cl} size={20} />
    </View>
  );
};

const LabelTab = ({tx, cl}) => {
  return <Text style={{color: cl, fontSize: 12, marginBottom: 2}}>{tx}</Text>;
};
