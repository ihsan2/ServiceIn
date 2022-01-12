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

const index = ({navigation}) => {
  const dispatch = useDispatch();
  const users = useSelector(state => state.userState.users);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [load, setLoad] = useState(false);

  useEffect(() => {
    dispatch(getUsers());
  }, []);

  const _login = () => {
    const x = users.filter(k => k.role === 'teknisi');
    let empty = !email || !password;

    if (empty) {
      showAlert({text: 'Email dan Password wajib diisi.', type: 'error'});
      return;
    }

    let loginData = x.filter(
      k => k.email.toLowerCase() === email.toLowerCase(),
    );

    if (loginData.length === 0) {
      showAlert({text: 'Email tidak terdaftar.', type: 'error'});
      return;
    }

    if (loginData[0].password !== password) {
      showAlert({text: 'Password salah.', type: 'error'});
      return;
    }

    setLoad(true);
    setTimeout(() => {
      if (loginData[0].verified) {
        dispatch(setRole('teknisi'));
        dispatch(setUser(loginData[0]));
        navigation.replace('Home');
      } else {
        if (loginData[0].isUpload) {
          navigation.navigate('Unverif');
        } else {
          navigation.replace('Verifikasi', {uid: loginData[0].uid});
        }
      }

      setLoad(false);
    }, 1000);
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

        <View style={{marginTop: 16}}>
          <Button onPress={_login} fullWidth loading={load}>
            Masuk
          </Button>
        </View>
        <TouchableOpacity
          style={{marginTop: 16, alignItems: 'center'}}
          onPress={() => navigation.navigate('Register')}>
          <Text center bold style={{color: colors.darkGrey}}>
            Belum Punya Akun?{' '}
            <Text style={{color: colors.primary}}>Daftar Sekarang</Text>
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
