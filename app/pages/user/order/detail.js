import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
} from 'react-native';
import Wrapper from '../../../components/wrapper';
import * as colors from '../../../styles/colors';
import {
  labelsWaiting,
  labelsPending,
  labelsCancel,
  labelsProcess,
  labelsDone,
} from '../../../dummy';
import {useNavigation} from '@react-navigation/native';
import Header from '../../../components/header';
import Step from '../../../components/card/step';
import Text from '../../../components/text';
import {MI, MCI} from '../../../assets/icons/index';
import Share from 'react-native-share';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import Button from '../../../components/button/index';
import Dialog from '../../../components/modal/dialog';
import database from '@react-native-firebase/database';
import {getOrders} from '../../../redux/actions/order';
import Input from '../../../components/input/main';
import {getOneData} from '../../../config';
import {sendNotif} from '../../../sendNotif';
import Toast from 'react-native-toast-message';

const detail = ({route}) => {
  const navigation = useNavigation();
  const user = useSelector(state => state.userState.user);
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [visible1, setVisible1] = useState(false);
  const [loadTolak, setLoadTolak] = useState(false);
  const [reason, setReason] = useState('');
  const [feed, setFeed] = useState('');
  const [saran, setSaran] = useState('');
  let {item} = route.params;
  const [device_id, setDeviceID] = useState('');
  let data =
    item.status === 'waiting'
      ? labelsWaiting
      : item.status === 'pending'
      ? labelsPending
      : item.status === 'process'
      ? labelsProcess
      : item.status === 'complete'
      ? labelsDone
      : labelsCancel;

  const _wa = () => {
    let number = `62${item?.teknisi?.phone.substr(1, 15)}`;
    const shareOptions = {
      title: 'Bagikan melalui',
      message: `Hello, Saya ${user.name}\nSaya ingin menanyakan pesanan dengan nomor order: *${item.uid}*`,
      social: Share.Social.WHATSAPP,
      whatsAppNumber: number,
    };

    Share.shareSingle(shareOptions);
  };

  useEffect(() => {
    _getToken();
  }, []);

  const _getToken = async () => {
    let u = await getOneData(`users/${item.id_teknisi}`);
    setDeviceID(u?.device_id);
  };

  const _location = () => {
    Linking.openURL(
      `google.navigation:q=${item?.teknisi?.lat},${item?.teknisi.lng}`,
    );
  };

  const _cancel = () => {
    setLoadTolak(true);
    database()
      .ref(`/orders/${item.uid}`)
      .update({status: 'cancel', reason: reason})
      .then(() => {
        sendNotif({
          title: 'Pesanan Dibatalkan oleh User',
          body: `Jangan sedih. Silahkan tunggu pesanan lain.`,
          parent: 'Order',
          link: 'Dibatalkan',
          device_id: device_id,
        });

        navigation.navigate('Selesai');
        setLoadTolak(false);
        dispatch(getOrders(user.uid));
      });
  };

  const _survei = () => {
    if (feed) {
      setLoadTolak(true);
      database()
        .ref(`/orders/${item.uid}`)
        .update({fback: feed, fback_text: saran ? saran : null})
        .then(() => {
          navigation.navigate('Selesai');
          setLoadTolak(false);
          dispatch(getOrders(user.uid));
        });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Silahkan Pilih Penilaian Terlebih dahulu, Ya / Tidak.',
        topOffset: 0,
        visibilityTime: 2400,
      });
    }
  };

  return (
    <Wrapper>
      <Header back title={'Detail Order'} />
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <Dialog
          isVisible={visible}
          closeModal={() => setVisible(false)}
          message={'Apakah yakin Anda ingin membatalkan pesanan?'}
          onSubmit={() => _cancel()}>
          <View style={{marginTop: 20, marginHorizontal: 10}}>
            <Text style={{marginBottom: 8}} bold>
              Alasan Pembatalan
            </Text>
            <Input
              placeholder={'Contoh: Maaf... Pesanan ingin diubah'}
              value={reason}
              onChangeText={x => setReason(x)}
            />
          </View>
        </Dialog>

        <Dialog
          isVisible={visible1}
          closeModal={() => setVisible1(false)}
          message={'Silahkan beri penilain kepada teknisi.'}
          onSubmit={() => _survei()}>
          <View style={{marginTop: 20, marginHorizontal: 10}}>
            <View style={{flexDirection: 'row', marginBottom: 20}}>
              {['Ya', 'Tidak'].map(el => {
                return (
                  <TouchableOpacity
                    onPress={() => setFeed(el)}
                    key={el}
                    style={{
                      borderWidth: 1,
                      flex: 1,
                      marginRight: el === 'Ya' ? 20 : 0,
                      padding: 20,
                      borderColor: colors.grey,
                      borderRadius: 10,
                      alignItems: 'center',
                      backgroundColor:
                        feed === el
                          ? el === 'Ya'
                            ? colors.green
                            : colors.red
                          : '#fff',
                    }}>
                    <Text
                      style={{
                        color: el === feed ? colors.white : '#000',
                        fontSize: 16,
                      }}>
                      {el}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={{marginBottom: 8}} bold>
              Saran (Masukan)
            </Text>
            <Input
              placeholder={'Saran (Masukan) Anda'}
              value={saran}
              onChangeText={x => setSaran(x)}
            />
          </View>
        </Dialog>
        <View
          style={{
            borderWidth: 0.6,
            borderColor: colors.grey,
            margin: 5,
            padding: 15,
            borderRadius: 5,
          }}>
          <Text style={{marginBottom: 10}} size={16}>
            No. Pesanan:{' '}
            <Text bold style={{color: colors.primary}}>
              {item?.uid}
            </Text>
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <MI name={'verified-user'} size={22} color={colors.primary} />
            <Text size={18} bold style={{marginLeft: 5, color: colors.primary}}>
              {item?.teknisi?.name}
            </Text>
          </View>
          <View style={{marginTop: 10}}>
            <Text size={16} bold>
              {item.jenis} - {item.merk}
            </Text>
          </View>
          <View style={{marginTop: 10}}>
            <Text bold style={{}}>
              Kerusakan:{' '}
              <Text style={{fontWeight: 'normal'}}>{item.kerusakan}</Text>
            </Text>
          </View>
          <View
            style={{
              marginTop: 10,
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}>
            <TouchableOpacity
              onPress={_wa}
              style={{
                backgroundColor: colors.white,
                width: 50,
                height: 50,
                borderRadius: 50 / 2,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <MCI name={'whatsapp'} size={30} color="#25D366" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={_location}
              style={{
                backgroundColor: colors.white,
                width: 50,
                height: 50,
                borderRadius: 50 / 2,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <MCI name={'map-marker'} size={30} color="#f44546" />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            borderWidth: 0.6,
            borderColor: colors.grey,
            margin: 5,
            padding: 15,
            borderRadius: 5,
          }}>
          {data.map((k, i) => (
            <Step
              key={i}
              item={k}
              index={i}
              data={data}
              status={item.status}
              item1={item}
            />
          ))}
        </View>
        <View
          style={{
            position: 'absolute',
            bottom: 16,
            width: '90%',
            alignSelf: 'center',
          }}>
          {item?.status === 'cancel' || item?.status === 'complete' ? (
            item?.status === 'complete' ? (
              <Button
                loading={loadTolak}
                fullWidth
                onPress={() => setVisible1(true)}
                bgMain={colors.green}>
                Nilai Orderan
              </Button>
            ) : null
          ) : item?.status === 'waiting' ? (
            <Button
              loading={loadTolak}
              fullWidth
              onPress={() => setVisible(true)}
              bgMain={colors.red}>
              Batalkan Pesanan
            </Button>
          ) : (
            <View
              style={{
                backgroundColor: '#E5E7E9',
                padding: 12,
                borderRadius: 10,
              }}>
              <Text center>
                Anda tidak dapat membatalkan pesanan saat teknisi sudah ke
                tempatmu. Silahkan hubungi teknisi terlebih dahulu untuk
                konfirmasi pembatalan.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </Wrapper>
  );
};

export default detail;

const styles = StyleSheet.create({});
