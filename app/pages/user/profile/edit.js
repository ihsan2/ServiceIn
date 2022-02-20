import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import Logo from '../../../components/logo';
import Wrapper from '../../../components/wrapper';
import Input from '../../../components/input/main';
import Text from '../../../components/text';
import {AD} from '../../../assets/icons/index';
import Button from '../../../components/button';
import * as colors from '../../../styles/colors';
import Header from '../../../components/header';
import {useDispatch, useSelector} from 'react-redux';
import {showAlert} from '../../../alert';
import database from '@react-native-firebase/database';
import {getUser} from '../../../redux/actions/user';

const index = ({navigation}) => {
  const user = useSelector(state => state.userState.user);

  const [name, setName] = useState(user?.name);
  const [phone, setPhone] = useState(user?.phone);
  const [load, setLoad] = useState(false);

  const dispatch = useDispatch();

  // const [address, setAddress] = useState('Jl. Sultan Alauddin');

  const _edit = () => {
    let empty = !name;

    if (empty) {
      showAlert({text: 'Nama wajib diisi.', type: 'error'});
      return;
    }

    let data = {
      name,
      phone: phone ? phone : null,
    };

    setLoad(true);
    database()
      .ref(`/users/${user.uid}`)
      .update(data)
      .then(() => {
        showAlert({text: 'Update profile berhasil.'});
        navigation.goBack(null);
        setLoad(false);
        dispatch(getUser(user.uid));
      });
  };

  return (
    <Wrapper>
      <Header title={'Ubah Profile'} back />
      <ScrollView style={styles.body}>
        {/* <View style={{width: '100%'}}>
          <Text style={{marginBottom: 8}} bold>
            Email
          </Text>
          <Input
            placeholder={'user@mail.com'}
            keyboardType="email-address"
            value={user.email}
            editable={false}
          />
          <Text style={{marginTop: 4, color: colors.darkGrey}} size={12}>
            Note: Email tidak dapat diubah.
          </Text>
        </View> */}
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
            No. Handphone
          </Text>
          <Input
            placeholder={'Contoh: 082XXXXXXXXX'}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={x => setPhone(x)}
          />
        </View>
        {/* <View style={{width: '100%', marginTop: 16}}>
          <Text style={{marginBottom: 8}} bold>
            Alamat
          </Text>
          <Input
            placeholder={'Contoh: Jl. Alauddin'}
            value={address}
            onChangeText={x => setAddress(x)}
          />
        </View> */}
        <View style={{marginTop: 16}}>
          <Button fullWidth onPress={_edit} loading={load}>
            Ubah Profile
          </Button>
        </View>
      </ScrollView>
    </Wrapper>
  );
};

export default index;

const styles = StyleSheet.create({
  body: {flex: 1, padding: 20},
});
