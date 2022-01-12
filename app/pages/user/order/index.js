import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import Wrapper from '../../../components/wrapper';
import * as colors from '../../../styles/colors';
import {menu} from '../../../dummy';
import {useNavigation} from '@react-navigation/native';
import Header from '../../../components/header';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {MCI} from '../../../assets/icons';
import Text from '../../../components/text';

const Tab = createMaterialTopTabNavigator();
import Berjalan from './berjalan';
import Selesai from './selesai';
import {useDispatch, useSelector} from 'react-redux';
import {getOrders} from '../../../redux/actions/order';

const index = ({route}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector(state => state.userState.user);
  const orders = useSelector(state => state.orderState.orders);

  let count_berjalan = orders.filter(
    k =>
      k.status === 'pending' ||
      k.status === 'waiting' ||
      k.status === 'process',
  ).length;

  let count_selesai = orders.filter(
    k => k.status === 'cancel' || k.status === 'complete',
  ).length;

  useEffect(() => {
    dispatch(getOrders(user.uid));
  }, []);

  const _badge = count => {
    return (
      count > 0 && (
        <View
          style={{
            width: 16,
            height: 16,
            backgroundColor: colors.redBadge,
            borderRadius: 16 / 2,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            right: -5,
            top: -6,
          }}>
          <Text size={12} style={{color: '#fff'}}>
            {count}
          </Text>
        </View>
      )
    );
  };

  return (
    <Wrapper>
      <Header title={'Order'} />
      <Tab.Navigator
        initialRouteName={'Berjalan'}
        tabBarOptions={{
          style: {backgroundColor: colors.primary},
          indicatorStyle: {backgroundColor: colors.white},
          activeTintColor: colors.white,
          inactiveTintColor: 'rgba(255,255,255,0.6)',
          labelStyle: {fontWeight: 'bold'},
          showIcon: true,
        }}>
        <Tab.Screen
          name="Berjalan"
          component={Berjalan}
          options={{
            tabBarIcon: ({focused}) => (
              <View>
                <MCI
                  name={'clock-outline'}
                  size={20}
                  color={focused ? '#fff' : 'rgba(255,255,255,0.6)'}
                />
                {_badge(count_berjalan)}
              </View>
            ),
            tabBarLabel: 'Berjalan',
          }}
        />
        <Tab.Screen
          name="Selesai"
          component={Selesai}
          options={{
            tabBarIcon: ({focused}) => (
              <View>
                <MCI
                  name={'briefcase-check-outline'}
                  size={20}
                  color={focused ? '#fff' : 'rgba(255,255,255,0.6)'}
                />
                {_badge(count_selesai)}
              </View>
            ),
            tabBarLabel: 'Selesai',
          }}
        />
      </Tab.Navigator>
    </Wrapper>
  );
};

export default index;
