import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import Logo from '../../../components/logo';
import Wrapper from '../../../components/wrapper';
import Input from '../../../components/input/main';
import Text from '../../../components/text';
import InputPassword from '../../../components/input/password';
import InputPicker from '../../../components/input/picker';
import {AD, MCI} from '../../../assets/icons/index';
import Button from '../../../components/button';
import * as colors from '../../../styles/colors';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import MapV from '../../../components/maps/main';
import {menu, regions} from '../../../dummy';
import emailRegex from 'email-regex';
import uuid from 'react-native-uuid';
import {useSelector} from 'react-redux';
import {showAlert} from '../../../alert';
import database from '@react-native-firebase/database';

Geocoder.init('AIzaSyDh0_cYDi7QnGOaXyax9jN2gdeD-X5jDR0');

const index = ({navigation}) => {
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [address, setAddress] = useState('');
  const [province, setProvince] = useState(null);
  const [kota, setKota] = useState('');
  const [v1, setV1] = useState(false);
  const [v2, setV2] = useState(false);
  const [jasa, setJasa] = useState(menu);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const [load, setLoad] = useState(false);
  const users = useSelector(state => state.userState.users);

  const _daftar = () => {
    let empty =
      !name ||
      !email ||
      !password ||
      !phone ||
      !province ||
      !kota ||
      jasa.filter(k => k.select).length === 0;
    let isValidEmail = emailRegex().test(email);
    let isValidPass = password.length < 6 ? false : true;
    let isExist =
      users.filter(k => k.email.toLowerCase() === email.toLowerCase()).length >
      0
        ? true
        : false;
    let uid = uuid.v4();

    if (empty) {
      showAlert({text: 'Semua data wajib diisi.', type: 'error'});
      return;
    }
    if (!isValidEmail) {
      showAlert({text: 'Email tidak valid.', type: 'error'});
      return;
    }
    if (!isValidPass) {
      showAlert({text: 'Minimal Password adalah 6 karakter.', type: 'error'});
      return;
    }
    if (isExist) {
      showAlert({text: 'Email telah terdaftar.', type: 'error'});
      return;
    }

    let data = {
      name,
      email,
      password,
      role: 'teknisi',
      uid,
      phone,
      provinsi: province.provinsi,
      kota,
      address,
      lat,
      lng,
      keahlian: jasa.filter(k => k.select),
      isUpload: false,
      verified: false,
    };

    setLoad(true);
    database()
      .ref(`/users/${uid}`)
      .set(data)
      .then(() => {
        showAlert({text: 'Pendaftaran berhasil.'});
        navigation.replace('Verifikasi', {uid});
        setLoad(false);
      });
  };

  useEffect(() => {
    _getLocation();
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

  return (
    <Wrapper>
      <ScrollView style={styles.body}>
        <Logo
          style={{marginTop: 20, alignSelf: 'center', width: 240, height: 240}}
        />
        <View style={{marginBottom: 24}}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 5,
            }}>
            <AD name={'arrowleft'} size={18} />
            <Text bold style={{marginLeft: 5}}>
              Kembali
            </Text>
          </TouchableOpacity>
          <Text size={28} bold>
            Daftar
          </Text>
        </View>
        <View style={{width: '100%'}}>
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
          <Text style={{marginBottom: 8}} bold>
            Email
          </Text>
          <Input
            placeholder={'teknisi@mail.com'}
            keyboardType="email-address"
            value={email}
            onChangeText={x => setEmail(x)}
          />
        </View>
        <View style={{width: '100%', marginTop: 16}}>
          <Text style={{marginBottom: 8}} bold>
            Password
          </Text>
          <InputPassword
            placeholder={'Minimal 6 Karaketer'}
            value={password}
            onChangeText={x => setPassword(x)}
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
            Provinsi
          </Text>
          <InputPicker
            data={regions}
            title={'Pilih Provinsi'}
            placeholder={'Pilih Provinsi'}
            close={() => setV1(false)}
            open={() => setV1(true)}
            setValue={x => {
              setProvince(x);
              setKota('');
            }}
            value={province ? province.provinsi : ''}
            visible={v1}
          />
        </View>

        <View style={{width: '100%', marginTop: 16}}>
          <Text style={{marginBottom: 8}} bold>
            Kota
          </Text>
          <InputPicker
            data={province?.kota}
            title={'Pilih Kota'}
            placeholder={'Pilih Kota'}
            close={() => setV2(false)}
            open={() => setV2(true)}
            setValue={x => setKota(x)}
            value={kota}
            visible={v2}
          />
        </View>

        <View style={{width: '100%', marginTop: 16}}>
          <Text style={{marginBottom: 8}} bold>
            tawarkan?
          </Text>
          <View style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 5}}>
            {jasa.map((k, i) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    let arr = [...jasa];
                    arr[i].select = !arr[i].select;
                    setJasa(arr);
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
                      k.select
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
      </ScrollView>
      <View style={{paddingTop: 10, backgroundColor: 'transparent'}}>
        <Button
          loading={load}
          fullWidth
          onPress={_daftar}
          style={{borderRadius: 0, paddingVertical: 20}}>
          Daftar
        </Button>
      </View>
    </Wrapper>
  );
};

export default index;

const styles = StyleSheet.create({
  body: {flex: 1, paddingHorizontal: 20},
});
