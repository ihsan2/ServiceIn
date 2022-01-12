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
import database from '@react-native-firebase/database';
import {showAlert} from '../../../alert';
import emailRegex from 'email-regex';
import uuid from 'react-native-uuid';
import {useSelector} from 'react-redux';

const index = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [load, setLoad] = useState(false);
  const users = useSelector(state => state.userState.users);

  const _daftar = () => {
    let empty = !name || !email || !password || !phone;
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
      role: 'user',
      uid,
      phone,
    };

    setLoad(true);
    database()
      .ref(`/users/${uid}`)
      .set(data)
      .then(() => {
        showAlert({text: 'Pendaftaran user berhasil, silahkan login.'});
        navigation.replace('LoginUser');
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
            Daftar
          </Text>
        </View>
        <View style={{width: '100%'}}>
          <Text style={{marginBottom: 8}} bold>
            Nama
          </Text>
          <Input
            placeholder={'Adi Jaya'}
            value={name}
            onChangeText={x => setName(x)}
          />
        </View>
        <View style={{width: '100%', marginTop: 16}}>
          <Text style={{marginBottom: 8}} bold>
            Email
          </Text>
          <Input
            placeholder={'user@mail.com'}
            keyboardType="email-address"
            value={email}
            onChangeText={x => setEmail(x)}
          />
        </View>
        <View style={{width: '100%', marginTop: 16}}>
          <Text style={{marginBottom: 8}} bold>
            No. Handphone
          </Text>
          <Input
            placeholder={'Contoh: 082XXXXXXXXX'}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={x => setPhone(x)}
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
        <View style={{marginTop: 16}}>
          <Button fullWidth onPress={_daftar} loading={load}>
            Daftar
          </Button>
        </View>
        <TouchableOpacity
          style={{marginTop: 16, alignItems: 'center'}}
          onPress={() => navigation.navigate('LoginUser')}>
          <Text center bold style={{color: colors.darkGrey}}>
            Sudah Punya Akun?{' '}
            <Text style={{color: colors.primary}}>Masuk Sekarang</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </Wrapper>
  );
};

export default index;

const styles = StyleSheet.create({
  body: {flex: 1, paddingHorizontal: 20},
});
