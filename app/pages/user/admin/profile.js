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
import {doLogout, getUser} from '../../../redux/actions/user';
import messaging from '@react-native-firebase/messaging';
import database from '@react-native-firebase/database';

const index = ({route}) => {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(state => state.userState.user);

  const _deleteToken = async () => {
    await messaging().deleteToken();
    database().ref(`/users/${user.uid}`).update({device_id: null});
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
          <View
            style={{
              borderRadius: 62 / 2,
              width: 62,
              height: 62,
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: colors.primary,
              borderWidth: 2,
              marginRight: 10,
            }}>
            <Image
              source={require('../../../assets/images/user.png')}
              style={{width: 60, height: 60, borderRadius: 60 / 2}}
            />
          </View>
          <View style={{flex: 1}}>
            <Text bold size={20} style={{color: colors.primary}}>
              {user?.name}
            </Text>
            <Text size={16}>{user?.email}</Text>
          </View>
        </View>
        <View style={{marginVertical: 20}}>
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
