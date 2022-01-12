import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, Image, ScrollView} from 'react-native';
import Wrapper from '../../../components/wrapper';
import * as colors from '../../../styles/colors';
import {useNavigation} from '@react-navigation/native';
import Header from '../../../components/header';
import Text from '../../../components/text';
import {MCI} from '../../../assets/icons';
import Dialog from '../../../components/modal/dialog';
import {useDispatch, useSelector} from 'react-redux';
import {doLogout, getUser, setUser} from '../../../redux/actions/user';
import messaging from '@react-native-firebase/messaging';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import Toast from 'react-native-toast-message';
import {launchImageLibrary} from 'react-native-image-picker';
import {showAlert} from '../../../alert';

const index = ({route}) => {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(state => state.userState.user);
  const [avatar, setAvatar] = useState(user?.avatar);

  const _deleteToken = async () => {
    await messaging().deleteToken();
    database().ref(`/users/${user.uid}`).update({device_id: null});
  };

  const _updateAvatar = async () => {
    launchImageLibrary({mediaType: 'photo'}, async res => {
      if (res.didCancel) {
        console.log('Cancel Upload');
      } else {
        const uriPhoto = res?.assets[0].uri;
        let userTmp = user;
        userTmp.avatar = uriPhoto;
        setAvatar(uriPhoto);
        dispatch(setUser(userTmp));
        await storage().ref(`avatar/${user.uid}.jpg`).putFile(uriPhoto);
        let avatarUrl = await storage()
          .ref(`avatar/${user.uid}.jpg`)
          .getDownloadURL();

        let data = {
          avatar: avatarUrl,
        };

        await database()
          .ref(`/users/${user.uid}`)
          .update(data)
          .then(() => {
            showAlert({text: 'Foto Berhasil Diupdate.'});
            setAvatar(avatarUrl);
          });
      }
    });
  };

  return (
    <Wrapper>
      <Header title={'Profile'} />
      <ScrollView contentContainerStyle={{padding: 20}}>
        <Dialog
          isVisible={visible}
          closeModal={() => setVisible(false)}
          message={'Apakah yakin Anda ingin keluar?'}
          onSubmit={() => {
            navigation.replace('OnBoarding');
            _deleteToken();
            dispatch(doLogout());
          }}
        />
        <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
          <TouchableOpacity
            onPress={() => _updateAvatar()}
            style={{
              borderRadius: 62 / 2,
              width: 62,
              height: 62,
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: colors.primary,
              borderWidth: 1,
              marginRight: 10,
            }}>
            <Image
              source={
                avatar
                  ? {uri: avatar}
                  : require('../../../assets/images/user.png')
              }
              style={{width: 60, height: 60, borderRadius: 60 / 2}}
            />
            <MCI
              name={'pencil-circle'}
              size={26}
              style={{
                position: 'absolute',
                bottom: -6,
                right: 0,
              }}
              color={colors.primary}
            />
          </TouchableOpacity>
          <View style={{flex: 1}}>
            <Text bold size={20} style={{color: colors.primary}}>
              {user?.name}
            </Text>
            <Text size={16}>{user?.email}</Text>
          </View>
        </View>
        <View style={{marginVertical: 20}}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('EditProfile');
            }}
            style={{
              paddingHorizontal: 15,
              paddingVertical: 12,
              borderWidth: 0.8,
              borderColor: colors.grey,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MCI name={'account-edit'} size={26} color={colors.primary} />
              <Text
                size={18}
                bold
                style={{color: colors.primary, marginLeft: 10}}>
                Profile
              </Text>
            </View>
            <MCI name={'chevron-right'} size={26} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setVisible(true)}
            style={{
              paddingHorizontal: 15,
              paddingVertical: 12,
              borderWidth: 0.8,
              borderColor: colors.grey,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 10,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MCI name={'logout'} size={26} color={colors.red} />
              <Text size={18} bold style={{color: colors.red, marginLeft: 10}}>
                Logout
              </Text>
            </View>
            <MCI name={'chevron-right'} size={26} color={colors.red} />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={{alignItems: 'center', marginBottom: 20}}>
        <Text bold>V 1.0.0</Text>
      </View>
    </Wrapper>
  );
};

export default index;
