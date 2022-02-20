import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ListView,
} from 'react-native';
import Logo from '../../../components/logo';
import Wrapper from '../../../components/wrapper';
import Input from '../../../components/input/main';
import Text from '../../../components/text';
import InputPassword from '../../../components/input/password';
import InputPicker from '../../../components/input/picker';
import InputDate from '../../../components/input/date';
import {AD, MCI} from '../../../assets/icons/index';
import Button from '../../../components/button';
import * as colors from '../../../styles/colors';
import Geocoder from 'react-native-geocoding';
import MapV from '../../../components/maps/main';
import {dist, regions} from '../../../dummy';
import Header from '../../../components/header';
import ModalUpload from '../../../components/modal/upload';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useSelector, useDispatch} from 'react-redux';
import {showAlert} from '../../../alert';
import database from '@react-native-firebase/database';
import {getUser} from '../../../redux/actions/user';
import {getMenu} from '../../../config';
import moment from 'moment';
import DropDownPicker from 'react-native-dropdown-picker';

Geocoder.init('AIzaSyDh0_cYDi7QnGOaXyax9jN2gdeD-X5jDR0');

const index = ({navigation}) => {
  const user = useSelector(state => state.userState.user);
  const dispatch = useDispatch();

  let prov = regions.filter(k => user?.provinsi === k.provinsi)[0];

  const [name, setName] = useState(user?.name);
  const [phone, setPhone] = useState(user?.phone);
  const [load, setLoad] = useState(false);

  const [lat, setLat] = useState(user?.lat);
  const [lng, setLng] = useState(user?.lng);
  const [address, setAddress] = useState(user?.address);
  const [province, setProvince] = useState(prov);
  const [kota, setKota] = useState(user?.kecamatan);
  const [v1, setV1] = useState(false);
  const [v2, setV2] = useState(false);
  const [jasa, setJasa] = useState([]);

  const [v3, setV3] = useState(false);
  const [f3, setF3] = useState([]);

  const [buka, setBuka] = useState(user?.jadwal?.buka ?? '');
  const [tutup, setTutup] = useState(user?.jadwal?.tutup ?? '');

  const [open1, setOpen1] = useState(false);
  const [value1, setValue1] = useState(user?.jadwal?.hari ?? []);
  const [itemHari, setItemHari] = useState([
    {
      label: 'Senin',
      value: 'Senin',
    },
    {
      label: 'Selasa',
      value: 'Selasa',
    },
    {
      label: 'Rabu',
      value: 'Rabu',
    },
    {
      label: 'Kamis',
      value: 'Kamis',
    },
    {
      label: 'Jumat',
      value: 'Jumat',
    },
    {
      label: 'Sabtu',
      value: 'Sabtu',
    },
    {
      label: 'Minggu',
      value: 'Minggu',
    },
  ]);

  useEffect(() => {
    _set();
  }, [navigation]);

  const _set = () => {
    getMenu().then(res => {
      let arr = [...res];
      let selected = [...user.keahlian];

      for (let x in arr) {
        for (let y in selected) {
          if (arr[x].id === selected[y].id) {
            if (!arr[x].select) {
              arr[x].select = true;
            }
          }
        }
      }
      setJasa(arr);
    });
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

  const _getAddress = (x, y) => {
    Geocoder.from({
      latitude: x,
      longitude: y,
    }).then(info => setAddress(info.results[0].formatted_address));
  };

  const _edit = () => {
    let empty =
      !name || !phone || !kota || jasa.filter(k => k.select).length === 0;

    if (empty) {
      showAlert({text: 'Semua data wajib diisi.', type: 'error'});
      return;
    }

    let data = {
      name,
      phone,
      provinsi: province.provinsi,
      kecamatan: kota,
      kota: 'Kab. Jeneponto',
      lat,
      lng,
      address,
      jadwal: {
        hari: value1.length ? value1 : null,
        buka: buka
          ? moment(new Date(buka)).format('YYYY/MM/DD HH:mm:ss')
          : null,
        tutup: tutup
          ? moment(new Date(tutup)).format('YYYY/MM/DD HH:mm:ss')
          : null,
      },
      keahlian: jasa.filter(k => k.select),
    };

    setLoad(true);
    database()
      .ref(`/users/${user.uid}`)
      .update(data)
      .then(() => {
        showAlert({text: 'Update profile berhasil.'});
        navigation.goBack();
        setLoad(false);
        dispatch(getUser(user.uid));
      });
  };

  return (
    <Wrapper>
      <Header title={'Ubah Profile'} back />
      <ScrollView style={styles.body}>
        <ModalUpload
          title={'Foto Usaha'}
          closeModal={() => setV3(false)}
          visible={v3}
          selectGalery={() => {
            launchImageLibrary(
              {
                mediaType: 'photo',
              },
              res => {
                if (res?.didCancel) {
                  setV3(false);
                } else {
                  setV3(false);
                  setF3([...f3, ...res?.assets]);
                }
              },
            );
          }}
          selectCamera={() => {
            launchCamera(
              {
                mediaType: 'photo',
              },
              res => {
                if (res?.didCancel) {
                  setV3(false);
                } else {
                  setV3(false);
                  setF3([...f3, ...res?.assets]);
                }
              },
            );
          }}
        />
        <View style={{width: '100%'}}>
          <Text style={{marginBottom: 8}} bold>
            Email
          </Text>
          <Input
            placeholder={'teknisi@mail.com'}
            keyboardType="email-address"
            value={user.email}
            editable={false}
          />
          <Text style={{marginTop: 4, color: colors.darkGrey}} size={12}>
            Note: Email tidak dapat diubah.
          </Text>
        </View>
        <View style={{width: '100%', marginTop: 16}}>
          <Text style={{marginBottom: 8}} bold>
            Nama Usaha
          </Text>
          <Input
            placeholder={'Nama usaha'}
            value={name}
            onChangeText={x => setName(x)}
          />
        </View>
        <View style={{width: '100%', marginTop: 16}}>
          <Text style={{marginBottom: 8}} bold>
            Nomor Handphone
          </Text>
          <Input
            placeholder={'Contoh: 0823XXXXXXXX'}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={x => setPhone(x)}
          />
        </View>

        <View style={{width: '100%', marginTop: 16}}>
          <View
            style={{
              marginBottom: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text bold>Lokasi Usaha</Text>
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
        </View>

        <View style={{width: '100%', marginTop: 16}}>
          <Text style={{marginBottom: 8}} bold>
            Kecamatan
          </Text>
          <InputPicker
            data={dist}
            title={'Pilih Kecamatan'}
            placeholder={'Pilih Kecamatan'}
            close={() => setV2(false)}
            open={() => setV2(true)}
            setValue={x => setKota(x)}
            value={kota}
            visible={v2}
          />
        </View>

        <View style={{marginTop: 20}}>
          <Text style={{marginBottom: 8}} bold>
            Jam Buka
          </Text>
          <InputDate
            placeholder={'Jam Buka'}
            value={buka ? moment(buka).format('HH:mm') : ''}
            setDate={x => setBuka(x)}
            mode={'time'}
          />
        </View>

        <View style={{marginTop: 20}}>
          <Text style={{marginBottom: 8}} bold>
            Jam Tutup
          </Text>
          <InputDate
            placeholder={'Jam Tutup'}
            value={tutup ? moment(tutup).format('HH:mm') : ''}
            setDate={x => setTutup(x)}
            mode={'time'}
          />
        </View>

        <View style={{width: '100%', marginTop: 20}}>
          <Text style={{marginBottom: 8}} bold>
            Hari
          </Text>
          <DropDownPicker
            open={open1}
            value={value1}
            items={itemHari}
            setOpen={setOpen1}
            setValue={setValue1}
            listMode="SCROLLVIEW"
            style={{borderColor: colors.grey}}
            multiple
            containerStyle={{marginBottom: 20}}
          />
        </View>

        <View style={{width: '100%', marginTop: 0, marginBottom: 10}}>
          <Text style={{marginBottom: 8}} bold>
            Jasa yang anda tawarkan?
          </Text>
          <View style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 5}}>
            {jasa.map((k, i) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    let arrx = [...jasa];
                    arrx[i].select = !arrx[i].select;
                    setJasa(arrx);
                  }}
                  key={k.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '30%',
                    marginBottom: 10,
                    marginRight: 10,
                  }}>
                  <MCI
                    name={
                      k?.select
                        ? 'checkbox-marked-circle'
                        : 'checkbox-blank-circle-outline'
                    }
                    color={colors.primary}
                    size={26}
                    style={{marginRight: 5}}
                  />
                  <Text size={16}>{k.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* <View style={{width: '100%', marginBottom: 40}}>
          <Text style={{marginBottom: 4}} bold>
            Foto Usaha
          </Text>
          <Text style={{marginBottom: 8}}>
            Foto tempat usaha anda atau foto saat anda melakukan aktifitas
            perbaikan.
          </Text>
          {f3.length < 3 && (
            <View
              style={{
                borderWidth: 1,
                borderColor: colors.grey,
                borderRadius: 5,
                padding: 20,
              }}>
              <TouchableOpacity
                onPress={() => setV3(true)}
                style={{alignItems: 'center'}}>
                <MCI name="upload-outline" color={colors.grey} size={60} />
                <Text color={colors.grey} bold>
                  Upload Foto (Maksimal 3 Foto)
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {f3.length > 0 && (
            <View
              style={{
                borderWidth: 1,
                borderColor: colors.grey,
                borderRadius: 5,
                padding: 20,
                marginTop: 10,
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              {f3.map((k, i) => (
                <View key={i} style={{marginRight: 10}}>
                  {_renderImage({
                    uri: k.uri,
                    close: () => {
                      let a = [...f3];
                      let f = a.filter(l => l.uri !== k.uri);
                      setF3(f);
                    },
                  })}
                </View>
              ))}
            </View>
          )}
        </View>
     */}
      </ScrollView>
      <View style={{paddingTop: 10, backgroundColor: 'transparent'}}>
        <Button
          loading={load}
          fullWidth
          onPress={_edit}
          style={{borderRadius: 0, paddingVertical: 20}}>
          Ubah Profile
        </Button>
      </View>
    </Wrapper>
  );
};

export default index;

const styles = StyleSheet.create({
  body: {flex: 1, padding: 20},
});
