import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Linking,
} from 'react-native';
import Wrapper from '../../../components/wrapper';
import Text from '../../../components/text';
import {MI, MCI} from '../../../assets/icons/index';
import * as colors from '../../../styles/colors';
import Header from '../../../components/header';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {Rating} from 'react-native-ratings';
import {Chase} from 'react-native-animated-spinkit';
import Share from 'react-native-share';
import {useDispatch, useSelector} from 'react-redux';
import {showAlert} from '../../../alert';
import database from '@react-native-firebase/database';
import {getOrders} from '../../../redux/actions/order';
import {sendNotif} from '../../../sendNotif';
import moment from 'moment';

const width = Dimensions.get('window').width;

const list = ({navigation, route}) => {
  const {item, data} = route.params;

  const [activeSlide, setActiveSlide] = useState(0);
  const [load, setLoad] = useState(false);

  const user = useSelector(state => state.userState.user);
  const dispatch = useDispatch();

  const _wa = () => {
    let number = `62${item?.phone.substr(1, 15)}`;
    const shareOptions = {
      title: 'Bagikan melalui',
      message: `Hello, Saya ${user.name}\nSaya ingin memperbaiki ${data.name} saya dengan merk *${data.merk}* dan kerusakan *${data.type}*`,
      social: Share.Social.WHATSAPP,
      whatsAppNumber: number,
    };

    Share.shareSingle(shareOptions);
  };

  const _location = () => {
    Linking.openURL(`google.navigation:q=${item?.lat},${item.lng}`);
  };

  const _order = () => {
    let uid = `ORD-${Date.now()}`;
    let dd = {
      uid,
      id_teknisi: item.uid,
      id_user: user.uid,
      lat: data.lat,
      lng: data.lng,
      kerusakan: data.type,
      jenis: data.name,
      merk: data.merk,
      photo: data.photo,
      status: 'waiting',
      teknisi: {
        name: item.name,
        phone: item.phone,
        lat: item.lat,
        lng: item.lng,
        address: item.address,
      },
      user: {
        name: user.name,
        phone: user.phone,
      },
      cretedAt: Date.now(),
      desc: data.desc,
    };

    setLoad(true);
    database()
      .ref(`/orders/${uid}`)
      .set(dd)
      .then(() => {
        sendNotif({
          title: 'Pesanan Baru',
          body: `Silahkan konfirmasi pesanan dari ${user.name}`,
          parent: 'Order',
          link: 'Berjalan',
          device_id: item?.device_id,
        });
        showAlert({text: 'Order berhasil.'});
        navigation.navigate('SuccessOrder');
        setLoad(false);
        dispatch(getOrders(user.uid));
      });
  };

  const _renderItem = k => {
    return (
      <View
        style={{
          alignItems: 'center',
        }}>
        <Image
          source={{uri: k}}
          style={{
            resizeMode: 'stretch',
            height: 220,
            width: '100%',
          }}
        />
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.3)',
            position: 'absolute',
            paddingHorizontal: 10,
            borderRadius: 20,
            paddingVertical: 2,
            right: 10,
            top: 10,
          }}>
          <Text style={{color: colors.white}}>
            {activeSlide + 1} / {item?.img?.length}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Wrapper>
      <Header back title={'Detail Teknisi'} />
      <ScrollView style={styles.body}>
        <View style={{marginTop: 0}}>
          <Carousel
            scrollEnabled={false}
            autoplay
            autoplayInterval={3000}
            loop
            style={styles.carousel}
            data={item?.img}
            renderItem={({item}) => _renderItem(item)}
            sliderWidth={width}
            itemWidth={width}
            inactiveSlideScale={1}
            onSnapToItem={index => setActiveSlide(index)}
          />
        </View>
        <View style={{margin: 20, marginBottom: 90}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <MI name={'verified-user'} size={22} color={colors.primary} />
            <Text size={18} bold style={{marginLeft: 5, color: colors.primary}}>
              {item?.name}
            </Text>
          </View>
          {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Rating
              size={200}
              imageSize={16}
              style={{
                alignSelf: 'flex-start',
                marginVertical: 10,
                marginRight: 10,
              }}
              count={5}
              readonly
              startingValue={0}
            />
            <Text bold>(0 / 5)</Text>
          </View> */}

          <View>
            <Text bold>
              {item?.distance} km -{' '}
              <Text style={{fontWeight: 'normal'}}>{item?.address}</Text>
            </Text>
          </View>
          <View style={{marginTop: 10}}>
            <Text bold>Hari</Text>
            {item?.jadwal?.hari?.length ? (
              <View
                style={{
                  marginTop: 5,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }}>
                {item?.jadwal?.hari.map(k => (
                  <View
                    key={k}
                    style={{
                      marginBottom: 5,
                      backgroundColor: colors.primary,
                      paddingVertical: 2,
                      paddingHorizontal: 12,
                      marginRight: 5,
                      borderRadius: 50,
                    }}>
                    <Text style={{color: colors.white}}>{k}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={{marginTop: 5}}>Jadwal belum diatur.</Text>
            )}
          </View>

          <View style={{marginTop: 10}}>
            <Text bold style={{}}>
              Jam Buka - Tutup
            </Text>
            <Text style={{marginTop: 5}}>
              {item?.jadwal?.buka
                ? moment(item?.jadwal?.buka).format('HH:mm')
                : '-'}{' '}
              -{' '}
              {item?.jadwal?.tutup
                ? moment(item?.jadwal?.tutup).format('HH:mm')
                : '-'}
            </Text>
          </View>

          <View style={{marginTop: 10}}>
            <Text bold style={{}}>
              Keahlian
            </Text>
            <View
              style={{
                marginTop: 5,
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}>
              {item?.keahlian.map(k => (
                <View
                  key={k.id}
                  style={{
                    marginBottom: 5,
                    backgroundColor: colors.primary,
                    paddingVertical: 2,
                    paddingHorizontal: 12,
                    marginRight: 5,
                    borderRadius: 50,
                  }}>
                  <Text style={{color: colors.white}}>{k.name}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={{marginTop: 10}}>
            <Text bold>Deskripsi</Text>
            <Text style={{marginTop: 5}}>
              Jasa perbaikan/service barang elektronik terbaik, tercepat, dan
              bergaransi. Dijamin puas telah melakukan perbaikan barang
              elektronik Anda di tempat kami.
            </Text>
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          backgroundColor: colors.primary,
          position: 'absolute',
          bottom: 20,
          width: '90%',
          alignSelf: 'center',
          borderWidth: 1,
          borderColor: colors.grey,
          borderRadius: 50,
          height: 54,
          justifyContent: 'center',
        }}>
        {load ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'center',
            }}>
            <Chase color={colors.white} size={24} />
            <Text bold style={{color: colors.white, marginLeft: 10}}>
              Silahkan Tunggu ...
            </Text>
          </View>
        ) : (
          <View style={{flexDirection: 'row', height: 36}}>
            <TouchableOpacity
              onPress={_wa}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
              }}>
              <MCI name="whatsapp" color={colors.white} size={20} />
              <Text bold style={{color: colors.white, marginLeft: 5}}>
                WhatsApp
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={_order}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                borderLeftWidth: 0.6,
                borderRightWidth: 0.6,
                borderColor: colors.white,
              }}>
              <MCI name="cart-plus" color={colors.white} size={26} />
              <Text bold size={16} style={{color: colors.white, marginLeft: 5}}>
                Order
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={_location}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
              }}>
              <MCI name="map-marker" color={colors.white} size={20} />
              <Text bold style={{color: colors.white, marginLeft: 5}}>
                Lokasi
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Wrapper>
  );
};

export default list;

const styles = StyleSheet.create({
  body: {flex: 1},
  carousel: {
    flexGrow: 0,
    marginBottom: 30,
  },
  carouselPagination: {
    paddingVertical: 0,
  },
  slidePaginationDotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 2,
    backgroundColor: colors.primary,
  },
  slidePaginationDotStyleInactive: {
    backgroundColor: colors.white,
    borderColor: colors.grey,
    borderWidth: 1,
  },
});
