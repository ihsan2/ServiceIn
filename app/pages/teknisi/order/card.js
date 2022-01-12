import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import Text from '../../../components/text';
import Button from '../../../components/button';
import * as colors from '../../../styles/colors';
import moment from 'moment';
import {MCI} from '../../../assets/icons';

const card = ({item, nav}) => {
  let stts =
    item.status === 'waiting'
      ? 'Konfirmasi Pesanan'
      : item.status === 'pending'
      ? 'Pengambilan Barang'
      : item.status === 'process'
      ? 'Pesanan Diproses'
      : item.status === 'complete'
      ? 'Selesai - Barang Siap Diantarkan/Diambil'
      : 'Dibatalkan';

  let clr =
    item.status === 'waiting'
      ? '#FF8300'
      : item.status === 'pending'
      ? '#01739D'
      : item.status === 'process'
      ? '#FEC900'
      : item.status === 'complete'
      ? '#18EBA0'
      : '#FC6060';

  return (
    <TouchableOpacity
      onPress={() => nav.navigate('DetailOrderTeknisi', {item, stts, clr})}
      style={{
        borderWidth: 0.4,
        borderColor: colors.grey,
        marginBottom: 10,
        borderRadius: 10,
        paddingVertical: 15,
      }}>
      <View
        style={{
          paddingHorizontal: 15,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View>
          <Text style={{marginBottom: 10}}>
            No. Pesanan:{' '}
            <Text bold style={{color: colors.primary}}>
              {item?.uid}
            </Text>
          </Text>
          <Text bold style={{color: colors.primary}}>
            {item?.user?.name}
          </Text>
          <Text bold>
            {item.jenis} - {item.merk}
          </Text>
        </View>
        <View>
          <MCI name={'arrow-right'} size={20} color={colors.grey} />
        </View>
      </View>
      <View
        style={{height: 0.5, backgroundColor: colors.grey, marginVertical: 15}}
      />
      <View style={{paddingHorizontal: 15}}>
        <View
          style={{
            backgroundColor: clr,
            alignSelf: 'flex-start',
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 5,
          }}>
          <Text bold style={{color: colors.white}}>
            {stts}
          </Text>
        </View>
        {item.status === 'process' && (
          <View style={{marginTop: 10}}>
            <Text>
              Perkiraan Waktu Selesai:{' '}
              {moment(item?.start).format('DD MMM YYYY')} -{' '}
              {moment(item?.end).format('DD MMM YYYY')}
            </Text>
          </View>
        )}
        {item.status === 'cancel' && (
          <View style={{marginTop: 10}}>
            <Text>Alasan Ditolak: {item.reason}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default card;
