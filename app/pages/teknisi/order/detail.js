import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
  Image,
} from 'react-native';
import Wrapper from '../../../components/wrapper';
import * as colors from '../../../styles/colors';
import {useNavigation} from '@react-navigation/native';
import Header from '../../../components/header';
import Text from '../../../components/text';
import {MI, MCI} from '../../../assets/icons/index';
import Share from 'react-native-share';
import Button from '../../../components/button';
import {useDispatch, useSelector} from 'react-redux';
import {getOrderTeknisi, updateStatus} from '../../../redux/actions/order';
import Dialog from '../../../components/modal/dialog';
import Input from '../../../components/input/main';
import InputDate from '../../../components/input/date';
import moment from 'moment';
import {showAlert} from '../../../alert';
import database from '@react-native-firebase/database';
import {getOneData} from '../../../config';
import {sendNotif} from '../../../sendNotif';

const detail = ({route}) => {
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);

  const [end, setEnd] = useState('');
  const [start, setStart] = useState('');
  const [reason, setReason] = useState('');

  const [loadTerima, setLoadTerima] = useState(false);
  const [loadTolak, setLoadTolak] = useState(false);
  const [loadProses, setLoadProses] = useState(false);
  const [loadDone, setLoadDone] = useState(false);

  const [device_id, setDeviceID] = useState('');

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector(state => state.userState.user);
  let {item, stts, clr} = route.params;

  useEffect(() => {
    _getToken();
  }, []);

  const _getToken = async () => {
    let u = await getOneData(`users/${item.id_user}`);
    setDeviceID(u?.device_id);
  };

  const _wa = () => {
    let number = `62${item?.user?.phone.substr(1, 15)}`;
    const shareOptions = {
      title: 'Bagikan melalui',
      message: `Hello, Saya dari ${user?.name}\nSaya ingin mengonfirmasi pesanan dengan nomor order: *${item?.uid}*`,
      social: Share.Social.WHATSAPP,
      whatsAppNumber: number,
    };

    Share.shareSingle(shareOptions);
  };

  const _location = () => {
    Linking.openURL(`google.navigation:q=${item?.lat},${item?.lng}`);
  };

  const _terima = () => {
    setLoadTerima(true);
    database()
      .ref(`/orders/${item.uid}`)
      .update({status: 'pending'})
      .then(() => {
        sendNotif({
          title: 'Pesanan Diterima',
          body: `Siapkan barang Anda. Teknisi sedang ke tempatmu.`,
          parent: 'Order',
          link: 'Berjalan',
          device_id: device_id,
        });

        showAlert({text: 'Pesanan diterima.'});
        navigation.navigate('PengambilanBarang');
        setLoadTerima(false);
        dispatch(getOrderTeknisi(user.uid));
      });
  };

  const _tolak = () => {
    setLoadTolak(true);
    database()
      .ref(`/orders/${item.uid}`)
      .update({status: 'cancel', reason: reason})
      .then(() => {
        sendNotif({
          title: 'Pesanan Dibatalkan',
          body: `Jangan sedih. Silahkan cari teknisi lain.`,
          parent: 'Order',
          link: 'Selesai',
          device_id: device_id,
        });

        showAlert({text: 'Pesanan ditolak.'});
        navigation.navigate('Dibatalkan');
        setLoadTolak(false);
        dispatch(getOrderTeknisi(user.uid));
      });
  };

  const _proses = () => {
    setLoadProses(true);
    database()
      .ref(`/orders/${item.uid}`)
      .update({
        status: 'process',
        start: moment(start).format('DD MMM YYYY'),
        end: moment(end).format('DD MMM YYYY'),
      })
      .then(() => {
        sendNotif({
          title: 'Pesanan Diproses',
          body: `Pesanan Anda sementara di Service oleh teknisi.`,
          parent: 'Order',
          link: 'Berjalan',
          device_id: device_id,
        });

        showAlert({text: 'Pesanan diproses.'});
        navigation.navigate('ProsesPesanan');
        setLoadProses(false);
        dispatch(getOrderTeknisi(user.uid));
      });
  };

  const _done = () => {
    setLoadDone(true);
    database()
      .ref(`/orders/${item.uid}`)
      .update({
        status: 'complete',
      })
      .then(() => {
        sendNotif({
          title: 'Pesanan Selesai',
          body: `Pesanan Anda Selesai. Barang Siap diantarkan/diambil.`,
          parent: 'Order',
          link: 'Selesai',
          device_id: device_id,
        });

        showAlert({text: 'Pesanan selesai.'});
        navigation.navigate('Selesai');
        setLoadDone(false);
        dispatch(getOrderTeknisi(user.uid));
      });
  };

  return (
    <Wrapper>
      <Header back title={'Detail Order'} />

      <ScrollView>
        <Dialog
          isVisible={visible1}
          closeModal={() => setVisible1(false)}
          message={'Apakah yakin Anda ingin membatalkan pesanan?'}
          onSubmit={_tolak}>
          <View style={{marginTop: 20, marginHorizontal: 10}}>
            <Text style={{marginBottom: 8}} bold>
              Alasan Pembatalan
            </Text>
            <Input
              placeholder={'Contoh: Maaf... Banyak Orderan'}
              value={reason}
              onChangeText={x => setReason(x)}
            />
          </View>
        </Dialog>

        <Dialog
          isVisible={visible2}
          closeModal={() => setVisible2(false)}
          message={'Silahkan Pilih Estimasi Waktu dalam penerjaan'}
          onSubmit={_proses}>
          <View style={{marginTop: 20, marginHorizontal: 10}}>
            <Text style={{marginBottom: 8}} bold>
              Tanggal Mulai
            </Text>
            <InputDate
              placeholder={'Pilih Tanggal Mulai'}
              value={start ? moment(start).format('DD MMM YYYY') : ''}
              setDate={x => setStart(x)}
            />
          </View>
          <View style={{marginTop: 10, marginHorizontal: 10}}>
            <Text style={{marginBottom: 8}} bold>
              Tanggal Selesai
            </Text>
            <InputDate
              placeholder={'Pilih Tanggal Selesai'}
              value={end ? moment(end).format('DD MMM YYYY') : ''}
              setDate={x => setEnd(x)}
              mode="time"
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
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text size={16} style={{marginBottom: 10}}>
              No. Pesanan:{' '}
              <Text bold style={{color: colors.primary}}>
                {item?.uid}
              </Text>
            </Text>
            <Text size={18} bold style={{color: colors.primary}}>
              {item.name}
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

          <View style={{marginTop: 10}}>
            <Text bold style={{}}>
              Deskripsi:{' '}
              <Text style={{fontWeight: 'normal'}}>
                {item.desc ? item?.desc : '-'}
              </Text>
            </Text>
          </View>

          {item?.photo && (
            <TouchableOpacity
              onPress={() => navigation.navigate('WebView', {url: item?.photo})}
              style={{marginVertical: 20}}>
              <Image
                source={{uri: item?.thum}}
                style={{width: 200, height: 200}}
              />
              <View
                style={{
                  width: 200,
                  height: 200,
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                  backgroundColor: 'rgba(0,0,0,0.2)',
                }}>
                <MCI name="play" size={60} color={colors.blue} />
              </View>
            </TouchableOpacity>
          )}

          <View
            style={{
              backgroundColor: clr,
              alignSelf: 'flex-start',
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 10,
            }}>
            <Text bold style={{color: colors.white}}>
              {stts}
            </Text>
          </View>

          {item.status == 'cancel' && (
            <View style={{marginTop: 10}}>
              <Text bold style={{}}>
                Alasan Pembatalan:
                <Text style={{fontWeight: 'normal'}}>{item.reason}</Text>
              </Text>
            </View>
          )}

          {item.status === 'process' && (
            <View style={{marginTop: 10}}>
              <Text>
                Perkiraan Waktu Selesai:{' '}
                {moment(item?.start).format('DD MMM YYYY')} -{' '}
                {moment(item?.end).format('DD MMM YYYY')}
              </Text>
            </View>
          )}

          {item.status === 'complete' && item?.fback ? (
            <View style={{marginTop: 10}}>
              <Text>
                Feedback User (Puas / Tidak): <Text bold>{item?.fback}</Text>
              </Text>
              <Text>
                Saran:{' '}
                <Text bold>{item?.fback_text ? item?.fback_text : '-'}</Text>
              </Text>
            </View>
          ) : null}

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
      </ScrollView>
      {item.status === 'waiting' && (
        <View style={{flexDirection: 'row'}}>
          <Button
            loading={loadTolak}
            onPress={() => setVisible1(true)}
            style={{borderRadius: 0, width: '50%', paddingVertical: 16}}
            bgMain={colors.orange}>
            Tolak
          </Button>
          <Button
            loading={loadTerima}
            style={{borderRadius: 0, width: '50%', paddingVertical: 16}}
            onPress={_terima}>
            Terima
          </Button>
        </View>
      )}

      {item.status === 'pending' && (
        <View style={{flexDirection: 'row'}}>
          <Button
            loading={loadProses}
            style={{borderRadius: 0, width: '100%', paddingVertical: 16}}
            onPress={() => {
              setVisible2(true);
            }}>
            Proses Barang
          </Button>
        </View>
      )}

      {item.status === 'process' && (
        <View style={{flexDirection: 'row'}}>
          <Button
            loading={loadDone}
            style={{borderRadius: 0, width: '100%', paddingVertical: 16}}
            onPress={_done}>
            Selesai
          </Button>
        </View>
      )}
    </Wrapper>
  );
};

export default detail;

const styles = StyleSheet.create({});
