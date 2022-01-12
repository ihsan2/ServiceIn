import React, {useEffect, useState} from 'react';
import {View, RefreshControl, ScrollView} from 'react-native';
import Wrapper from '../../../components/wrapper';
import * as colors from '../../../styles/colors';
import {listOrder} from '../../../dummy';
import {useNavigation} from '@react-navigation/native';
import Card from './card';
import Empty from '../../../components/empty';
import {useDispatch, useSelector} from 'react-redux';
import {getOrderTeknisi} from '../../../redux/actions/order';

const index = ({route, data}) => {
  const navigation = useNavigation();
  const [refresh, setRefresh] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(state => state.userState.user);

  let _refresh = () => {
    setRefresh(true);
    dispatch(getOrderTeknisi(user.uid))
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
        <View style={{margin: 20, marginTop: 10}}>
          {data.length > 0 ? (
            <View>
              {data.map((k, i) => (
                <Card item={k} key={i} nav={navigation} />
              ))}
            </View>
          ) : (
            <Empty desc={'Data kosong'} />
          )}
        </View>
      </ScrollView>
    </Wrapper>
  );
};

export default index;
