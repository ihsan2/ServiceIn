import React, {useEffect, useState} from 'react';
import {View, RefreshControl, ScrollView} from 'react-native';
import Wrapper from '../../../components/wrapper';
import * as colors from '../../../styles/colors';
import {listOrder} from '../../../dummy';
import {useNavigation} from '@react-navigation/native';
import Card from './card';
import {useDispatch, useSelector} from 'react-redux';
import {getOrders} from '../../../redux/actions/order';
import Empty from '../../../components/empty';

const index = ({route}) => {
  const navigation = useNavigation();
  const orders = useSelector(state => state.orderState.orders);
  const user = useSelector(state => state.userState.user);
  const [refresh, setRefresh] = useState(false);
  const dispatch = useDispatch();

  let data = orders.filter(
    k =>
      k.status === 'pending' ||
      k.status === 'waiting' ||
      k.status === 'process',
  );

  let _refresh = () => {
    setRefresh(true);
    dispatch(getOrders(user.uid))
      .then(() => {
        setRefresh(false);
      })
      .catch(() => setRefresh(false));
  };

  return (
    <Wrapper>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={_refresh} />
        }>
        {data.length > 0 ? (
          <View style={{margin: 20, marginTop: 10}}>
            {data.map((k, i) => (
              <Card item={k} key={i} nav={navigation} />
            ))}
          </View>
        ) : (
          <Empty desc={'Data kosong'} />
        )}
      </ScrollView>
    </Wrapper>
  );
};

export default index;
