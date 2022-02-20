import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import Wrapper from '../../../components/wrapper';
import Input from '../../../components/input/main';
import Text from '../../../components/text';
import {AD, MCI} from '../../../assets/icons/index';
import Button from '../../../components/button';
import * as colors from '../../../styles/colors';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import MapV from '../../../components/maps/main';
import Header from '../../../components/header';
import {useSelector, useDispatch} from 'react-redux';
import {getUsers} from '../../../redux/actions/user';
import {getDistance} from 'geolib';
import {showAlert} from '../../../alert';
import {getOneData} from '../../../config';
import DropDownPicker from 'react-native-dropdown-picker';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import ModalUpload from '../../../components/modal/upload';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import uuid from 'react-native-uuid';

Geocoder.init('AIzaSyDh0_cYDi7QnGOaXyax9jN2gdeD-X5jDR0');

const index = ({navigation, route}) => {
  const {item} = route.params;

  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [address, setAddress] = useState('');
  const [merk, setMerk] = useState('');
  const [type, setType] = useState('');
  const [load, setLoad] = useState(false);

  const [open1, setOpen1] = useState(false);
  const [value1, setValue1] = useState(null);
  const [itemKerusakan, setItemKerusakan] = useState([]);

  const [open2, setOpen2] = useState(false);
  const [value2, setValue2] = useState(null);
  const [itemMerk, setItemMerk] = useState([]);

  const [v1, setV1] = useState(false);
  const [f1, setF1] = useState(false);

  const [est, setEst] = useState('');
  const [desc, setDesc] = useState('');

  const dispatch = useDispatch();
  const users = useSelector(state => state.userState.users);
  const user = useSelector(state => state.userState.user);
  let list = users.filter(k => k.role === 'teknisi' && k.verified);
  let filteredData = list.filter(value => {
    const x = item.name.toLowerCase();
    const res = value.keahlian.some(k => k.name.toLowerCase().includes(x));
    return res;
  });

  useEffect(() => {
    _getLocation();
    dispatch(getUsers());
    _getKerusakan();
    _getMerk();
    _getHarga();
  }, []);

  const _getLocation = () => {
    Geolocation.getCurrentPosition(info => {
      setLat(info.coords.latitude);
      setLng(info.coords.longitude);
      _getAddress(info.coords.latitude, info.coords.longitude);
    });
  };

  const _getAddress = (x, y) => {
    Geocoder.from({
      latitude: x,
      longitude: y,
    }).then(info => setAddress(info.results[0].formatted_address));
  };

  const _submit = async () => {
    let empty = !value1 || !value2 || !desc;

    if (empty) {
      showAlert({
        text: 'Merk, Kerusakan, dan Deskripsi wajib diisi.',
        type: 'error',
      });
      return;
    }

    if (!user?.phone) {
      showAlert({
        text: 'Profile belum lengkap. Silahkan lengkapi profile terlebih dahulu untuk memesan.',
        type: 'error',
      });
      return;
    }

    setLoad(true);
    setTimeout(async () => {
      let distances = filteredData.map(k =>
        (
          getDistance(
            {
              latitude: lat,
              longitude: lng,
            },
            {
              latitude: k.lat,
              longitude: k.lng,
            },
          ) / 1000
        ).toFixed(2),
      );

      for (let x in filteredData) {
        for (let y in distances) {
          if (x === y) {
            filteredData[x].distance = distances[y];
          }
        }
      }

      const listData = filteredData.sort((a, b) => a.distance > b.distance);

      let arr = [];
      for (let x in listData) {
        let dd = await getOneData(`document/${listData[x].uid}`);
        arr.push(dd);
      }

      for (let x in listData) {
        for (let y in arr) {
          if (x === y) {
            listData[x].img = arr[y].usaha;
          }
        }
      }

      let id = uuid.v4();
      await storage().ref(`foto-kerusakan/${id}.jpg`).putFile(f1[0].uri);
      let urlPhoto = await storage()
        .ref(`foto-kerusakan/${id}.jpg`)
        .getDownloadURL();

      let d = {
        lat,
        lng,
        address,
        type: value1,
        merk: value2,
        photo: urlPhoto,
        desc: desc,
      };
      navigation.navigate('ListService', {
        item: {...item, ...d},
        list: listData,
      });
      setLoad(false);
    }, 1000);
  };

  const _getKerusakan = async () => {
    let snap = await database().ref(`/kerusakan/${item.name}`).once('value');
    let arr = [];

    for (let x in snap.val()) {
      let newD = {
        label: snap.val()[x],
        value: snap.val()[x],
      };
      arr = [...arr, newD];
    }

    setItemKerusakan(arr);
  };

  const _getHarga = async () => {
    let snap = await database().ref(`/harga/${item.name}`).once('value');
    setEst(snap.val());
  };

  const _getMerk = async () => {
    let snap = await database().ref(`/merk/${item.name}`).once('value');
    let arr = [];

    for (let x in snap.val()) {
      let newD = {
        label: snap.val()[x],
        value: snap.val()[x],
      };
      arr = [...arr, newD];
    }

    setItemMerk(arr);
  };

  const _renderImage = ({uri = null, close = null} = {}) => {
    return (
      <View
        style={{
          alignItems: 'center',
          alignSelf: 'center',
        }}>
        <Image
          source={{
            uri: uri,
          }}
          style={{width: 80, height: 80, borderRadius: 5, marginBottom: 5}}
        />
        <View style={{flexDirection: 'row'}}>
          <AD
            name={'eyeo'}
            size={26}
            style={{marginRight: 5}}
            onPress={() => navigation.navigate('Image', {uri})}
          />
          <AD name={'close'} size={26} color={colors.red} onPress={close} />
        </View>
      </View>
    );
  };

  return (
    <Wrapper>
      <Header back title={'Form Pencarian'} />
      <ScrollView style={styles.body}>
        <View
          style={{
            backgroundColor: colors.lightGrey,
            paddingHorizontal: 20,
            paddingVertical: 15,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <MCI
            name={item.icon}
            color={colors.primary}
            size={20}
            style={{marginRight: 10}}
          />
          <Text bold>{item.name}</Text>
        </View>
        <View style={{paddingHorizontal: 20, marginVertical: 20}}>
          <View style={{width: '100%'}}>
            <Text style={{marginBottom: 8}} bold>
              Merk
            </Text>
            <DropDownPicker
              open={open2}
              value={value2}
              items={itemMerk}
              setOpen={setOpen2}
              setValue={setValue2}
              listMode="SCROLLVIEW"
              style={{borderColor: colors.grey}}
            />
          </View>
          <View style={{width: '100%', marginTop: 16}}>
            <Text style={{marginBottom: 8}} bold>
              Jenis Kerusakan
            </Text>
            <DropDownPicker
              zIndex={100}
              open={open1}
              value={value1}
              items={itemKerusakan}
              setOpen={setOpen1}
              setValue={setValue1}
              listMode="SCROLLVIEW"
              style={{borderColor: colors.grey}}
            />
          </View>
          <View style={{width: '100%', marginTop: 20}}>
            <Text style={{marginBottom: 4}} bold>
              Foto Kerusakan
            </Text>
            <Text style={{marginBottom: 8}}>
              Foto Keruskan Alat Elektronik Kamu
            </Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: colors.grey,
                borderRadius: 5,
                padding: 20,
              }}>
              {f1 ? (
                _renderImage({uri: f1[0].uri, close: () => setF1(null)})
              ) : (
                <TouchableOpacity
                  onPress={() => setV1(true)}
                  style={{alignItems: 'center'}}>
                  <MCI name="upload-outline" color={colors.grey} size={60} />
                  <Text color={colors.grey} bold>
                    Upload Foto
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={{width: '100%', marginTop: 20}}>
            <Text style={{marginBottom: 4}} bold>
              Estimasi Harga
            </Text>
            <Text style={{marginBottom: 8}}>{est}</Text>
          </View>

          <ModalUpload
            title={'Foto Kerusakan'}
            closeModal={() => setV1(false)}
            visible={v1}
            selectGalery={() => {
              launchImageLibrary(
                {
                  mediaType: 'photo',
                },
                res => {
                  setV1(false);
                  setF1(res?.assets);
                },
              );
            }}
            selectCamera={() => {
              launchCamera(
                {
                  mediaType: 'photo',
                },
                res => {
                  setV1(false);
                  setF1(res?.assets);
                },
              );
            }}
          />

          {/* <View style={{width: '100%', marginTop: 16}}>
            <View
              style={{
                marginBottom: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text bold>Lokasi User</Text>
              <Text
                bold
                style={{color: colors.primary}}
                onPress={() =>
                  navigation.navigate('Maps', {
                    latitude: lat,
                    longitude: lng,
                    onPress: (x, y) => {
                      setLat(x);
                      setLng(y);
                      _getAddress(x, y);
                    },
                  })
                }>
                Ubah Lokasi
              </Text>
            </View>
            <View style={{height: 120}}>
              <MapV lat={lat} lng={lng} />
            </View>
            <Text style={{marginTop: 5}}>{address}</Text>
          </View> */}
          <View style={{width: '100%', marginTop: 10, marginBottom: 50}}>
            <Text style={{marginBottom: 4}} bold>
              Deskripsi
            </Text>
            <Input
              value={desc}
              multiline={true}
              onChangeText={x => {
                setDesc(x);
              }}
            />
          </View>
          <View style={{marginTop: 20, backgroundColor: 'transparent'}}>
            <Button fullWidth onPress={_submit} loading={load}>
              Cari
            </Button>
          </View>
        </View>
      </ScrollView>
    </Wrapper>
  );
};

export default index;

const styles = StyleSheet.create({
  body: {flex: 1},
});
