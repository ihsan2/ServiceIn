import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import Wrapper from '../../../components/wrapper';
import * as colors from '../../../styles/colors';
import {listOrder1, menu} from '../../../dummy';
import {useNavigation} from '@react-navigation/native';
import Header from '../../../components/header';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {MCI} from '../../../assets/icons';
import Text from '../../../components/text';

const Tab = createMaterialTopTabNavigator();
import TabPage from './tab';
import {useSelector, useDispatch} from 'react-redux';
import {getOrderTeknisi} from '../../../redux/actions/order';

const index = ({route}) => {
  const navigation = useNavigation();
  const orders_tek = useSelector(state => state.orderState.orders_tek);

  const dispatch = useDispatch();
  const user = useSelector(state => state.userState.user);

  useEffect(() => {
    dispatch(getOrderTeknisi(user.uid));
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
          tabStyle: {width: 'auto'},
          scrollEnabled: true,
          style: {backgroundColor: colors.primary, width: 'auto'},
          indicatorStyle: {backgroundColor: colors.white},
          activeTintColor: colors.white,
          inactiveTintColor: 'rgba(255,255,255,0.6)',
          labelStyle: {fontWeight: 'bold'},
          showIcon: true,
        }}>
        <Tab.Screen
          name="KonfirmasiPesanan"
          children={() => (
            <TabPage data={orders_tek.filter(k => k.status === 'waiting')} />
          )}
          options={{
            tabBarIcon: ({focused}) => (
              <View>
                <MCI
                  name={'timer-sand'}
                  size={20}
                  color={focused ? '#fff' : 'rgba(255,255,255,0.6)'}
                />
                {_badge(orders_tek.filter(k => k.status === 'waiting').length)}
              </View>
            ),
            tabBarLabel: 'Konfirmasi Pesanan',
          }}
        />
        <Tab.Screen
          name="PengambilanBarang"
          children={() => (
            <TabPage data={orders_tek.filter(k => k.status === 'pending')} />
          )}
          options={{
            tabBarIcon: ({focused}) => (
              <View>
                <MCI
                  name={'car-estate'}
                  size={20}
                  color={focused ? '#fff' : 'rgba(255,255,255,0.6)'}
                />
                {_badge(orders_tek.filter(k => k.status === 'pending').length)}
              </View>
            ),
            tabBarLabel: 'Ambil Barang',
          }}
        />
        <Tab.Screen
          name="ProsesPesanan"
          children={() => (
            <TabPage data={orders_tek.filter(k => k.status === 'process')} />
          )}
          options={{
            tabBarIcon: ({focused}) => (
              <View>
                <MCI
                  name={'clock-outline'}
                  size={20}
                  color={focused ? '#fff' : 'rgba(255,255,255,0.6)'}
                />
                {_badge(orders_tek.filter(k => k.status === 'process').length)}
              </View>
            ),
            tabBarLabel: 'Proses Pesanan',
          }}
        />
        <Tab.Screen
          name="Selesai"
          children={() => (
            <TabPage data={orders_tek.filter(k => k.status === 'complete')} />
          )}
          options={{
            tabBarIcon: ({focused}) => (
              <View>
                <MCI
                  name={'briefcase-check-outline'}
                  size={20}
                  color={focused ? '#fff' : 'rgba(255,255,255,0.6)'}
                />
                {_badge(orders_tek.filter(k => k.status === 'complete').length)}
              </View>
            ),
            tabBarLabel: 'Selesai',
          }}
        />
        <Tab.Screen
          name="Dibatalkan"
          children={() => (
            <TabPage data={orders_tek.filter(k => k.status === 'cancel')} />
          )}
          options={{
            tabBarIcon: ({focused}) => (
              <View>
                <MCI
                  name={'cart-remove'}
                  size={20}
                  color={focused ? '#fff' : 'rgba(255,255,255,0.6)'}
                />
                {_badge(orders_tek.filter(k => k.status === 'cancel').length)}
              </View>
            ),
            tabBarLabel: 'Dibatalkan',
          }}
        />
      </Tab.Navigator>
    </Wrapper>
  );
};

export default index;
