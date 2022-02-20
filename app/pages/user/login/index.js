import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import Logo from '../../../components/logo';
import Wrapper from '../../../components/wrapper';
import Input from '../../../components/input/main';
import Text from '../../../components/text';
import InputPassword from '../../../components/input/password';
import {AD} from '../../../assets/icons/index';
import Button from '../../../components/button';
import * as colors from '../../../styles/colors';
import {useDispatch, useSelector} from 'react-redux';
import {getUsers, setRole, setUser} from '../../../redux/actions/user';
import {showAlert} from '../../../alert';
import uuid from 'react-native-uuid';
import database from '@react-native-firebase/database';

const index = ({navigation}) => {
  const dispatch = useDispatch();
  const users = useSelector(state => state.userState.users);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [load, setLoad] = useState(false);
  const [isValid, setValid] = useState(false);

  useEffect(() => {
    dispatch(getUsers());
  }, []);

  const _login = () => {
    const x = users.filter(k => k.role === 'user' || k.role === 'admin');
    let empty = !phone;

    if (empty) {
      showAlert({text: 'Nomor Telepon wajib diisi.', type: 'error'});
      return;
    }

    let loginData = x.filter(
      k => k?.phone?.toLowerCase() === phone.toLowerCase(),
    );

    if (loginData.length === 0) {
      setValid(true);
    } else {
      setLoad(true);
      setTimeout(() => {
        dispatch(setRole(loginData[0].role));
        dispatch(setUser(loginData[0]));
        if (loginData[0].role === 'user') {
          navigation.replace('HomeUser');
        } else {
          navigation.replace('AdminHome');
        }
        setLoad(false);
      }, 1000);
    }
  };

  const _regis = () => {
    let empty = !name;

    if (empty) {
      showAlert({text: 'Nama wajib diisi.', type: 'error'});
      return;
    }

    let uid = uuid.v4();
    let data = {
      name,
      phone,
      role: 'user',
      uid,
    };
    setLoad(true);
    database()
      .ref(`/users/${uid}`)
      .set(data)
      .then(() => {
        showAlert({text: 'Berhasil login.'});
        dispatch(setRole('user'));
        dispatch(setUser(data));
        navigation.replace('HomeUser');
        setLoad(false);
      });
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
            Masuk
          </Text>
        </View>
        <View style={{width: '100%'}}>
          <Text style={{marginBottom: 8}} bold>
            Masukkan No. HP
          </Text>
          <Input
            placeholder={'082xxxxxxxx'}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={x => setPhone(x)}
          />
        </View>

        {isValid && (
          <View style={{width: '100%', marginTop: 10}}>
            <Text style={{marginBottom: 8}} bold>
              Nomor Anda belum terdaftar. Silahkan masukkan nama Anda terlebih
              dahulu untuk melanjutkan.
            </Text>
            <Input
              placeholder={'Masukkan nama Anda'}
              value={name}
              onChangeText={x => setName(x)}
            />
          </View>
        )}

        <View style={{marginTop: 16}}>
          <Button onPress={!isValid ? _login : _regis} fullWidth loading={load}>
            Masuk
          </Button>
        </View>
      </ScrollView>
    </Wrapper>
  );
};

export default index;

const styles = StyleSheet.create({
  body: {flex: 1, paddingHorizontal: 20},
});
