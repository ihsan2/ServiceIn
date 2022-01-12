import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, ScrollView, RefreshControl} from 'react-native';
import Text from '../../../components/text';
import Wrapper from '../../../components/wrapper';
import * as colors from '../../../styles/colors';
import Search from '../../../components/input/search';
import {MCI} from '../../../assets/icons';
import {menu} from '../../../dummy';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {getListUser} from '../../../redux/actions/user';
import InputPicker from '../../../components/input/picker';

const dataFilter = ['Terverifikasi', 'Tidak Terverifikasi'];

const index = () => {
  const isFocus = useIsFocused();
  const list = useSelector(state => state.userState.listUser);
  const [data, setData] = useState(list.filter(k => !k.verified));
  const [data1, setData1] = useState(list.filter(k => !k.verified));
  const [filter, setFilter] = useState(dataFilter[1]);
  const [refresh, setRefresh] = useState(false);
  const [v1, setV1] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    _getList();
  }, [isFocus, filter]);

  const _getList = () => {
    dispatch(getListUser()).then(res => {
      if (filter === 'Terverifikasi') {
        setData(res.filter(k => k.verified));
        setData1(res.filter(k => k.verified));
      } else {
        setData(res.filter(k => !k.verified));
        setData1(res.filter(k => !k.verified));
      }
    });
  };

  const _refresh = f => {
    setRefresh(true);
    dispatch(getListUser())
      .then(res => {
        setRefresh(false);
        if (f === 'Terverifikasi') {
          setData(res.filter(k => k.verified));
          setData1(res.filter(k => k.verified));
        } else {
          setData(res.filter(k => !k.verified));
          setData1(res.filter(k => !k.verified));
        }
      })
      .catch(() => setRefresh(false));
  };

  return (
    <Wrapper>
      <View style={{backgroundColor: colors.primary, padding: 12}}>
        <Search
          placeholder={'Cari Teknisi...'}
          onChangeText={x => {
            let res = data1.filter(k =>
              k.name.toLowerCase().match(x.toLowerCase()),
            );
            setData(res);
          }}
        />
        <View style={{marginBottom: 5}} />
        <InputPicker
          data={dataFilter}
          title={'Filter Teknsisi'}
          placeholder={'Filter Teknisi'}
          close={() => setV1(false)}
          open={() => setV1(true)}
          setValue={x => {
            setFilter(x);
            let d = list.filter(k =>
              x === 'Terverifikasi' ? k.verified : !k.verified,
            );
            setData(d);
            setData1(d);
          }}
          value={filter ? filter : ''}
          visible={v1}
        />
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={() => _refresh(filter)}
          />
        }
        style={{
          marginVertical: 10,
        }}>
        {data.map((k, i) => {
          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('AdminDetail', {
                  item: k,
                  setFilter: () => setFilter(dataFilter[0]),
                })
              }
              key={i}
              style={{
                borderWidth: 0.6,
                borderColor: colors.grey,
                marginBottom: 12,
                marginHorizontal: 12,
                padding: 12,
                borderRadius: 5,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text bold size={15} style={{marginRight: 15}}>
                {k.name}
              </Text>
              <MCI name={'chevron-right'} color={colors.primary} size={24} />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </Wrapper>
  );
};

export default index;
