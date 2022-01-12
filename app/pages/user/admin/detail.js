import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
  Image,
} from 'react-native';
import Wrapper from '../../../components/wrapper';
import * as colors from '../../../styles/colors';
import {useNavigation} from '@react-navigation/native';
import Header from '../../../components/header';
import Text from '../../../components/text';
import {MI, MCI, AD} from '../../../assets/icons/index';
import Share from 'react-native-share';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import {getOneData} from '../../../config';
import Button from '../../../components/button';
import database from '@react-native-firebase/database';
import {getListUser} from '../../../redux/actions/user';
import {showAlert} from '../../../alert';
import RNSmtpMailer from 'react-native-smtp-mailer';

const detail = ({route}) => {
  const navigation = useNavigation();
  const [doc, setDoc] = useState(null);
  const [load1, setLoad1] = useState(false);
  const [load2, setLoad2] = useState(false);
  let {item, setFilter} = route.params;
  const list = useSelector(state => state.userState.listUser);

  const dispatch = useDispatch();

  const _wa = () => {
    let number = `62${item?.phone.substr(1, 15)}`;
    const shareOptions = {
      title: 'Bagikan melalui',
      message: `Hello, Saya admin dari Service.in.`,
      social: Share.Social.WHATSAPP,
      whatsAppNumber: number,
    };

    Share.shareSingle(shareOptions);
  };

  const _location = () => {
    Linking.openURL(`google.navigation:q=${item?.lat},${item?.lng}`);
  };

  useEffect(async () => {
    let dd = await getOneData(`document/${item.uid}`);
    setDoc(dd);
  }, []);

  const _terima = () => {
    setLoad1(true);
    database()
      .ref(`/users/${item.uid}`)
      .update({verified: true})
      .then(() => {
        showAlert({text: 'Teknisi Berhasil DiVerifikasi.'});
        navigation.goBack();
        setLoad1(false);
        setFilter();
        _sendMail(
          'Verifikasi Akun',
          '<h3>Selamat Akun Anda Telah Terverifikasi</h3><p>Silahkan Login Menggunakan Email & Password di Aplikasi Service.in.</p>',
        );
      });
  };

  const _tolak = () => {
    setLoad2(true);
    database()
      .ref(`/users/${item.uid}`)
      .update({isUpload: false})
      .then(() => {
        showAlert({
          text: 'Menolak Dokumen Verifikasi Teknisi.',
          type: 'info',
        });
        navigation.goBack();
        setLoad2(false);
        _sendMail(
          'Verifikasi Akun',
          '<h3>Maaf Akun Anda Belum Terverifikasi</h3><p>Maaf, Dokumen yang anda kirim belum bisa kami verifikasi. Silahkan kirim kembali dokumen anda di Aplikasi Service.in dengan login sebagai teknisi menggunkan email dan password.</p>',
        );
      });
  };

  const _sendMail = (subject, body) => {
    RNSmtpMailer.sendMail({
      mailhost: 'smtp.gmail.com',
      port: '465',
      ssl: true, // optional. if false, then TLS is enabled. Its true by default in android. In iOS TLS/SSL is determined automatically, and this field doesn't affect anything
      username: 'servicein878@gmail.com',
      password: 'v.persie20',
      fromName: 'Service.in Admin', // optional
      recipients: item.email,
      subject: subject,
      htmlBody: body,
    })
      .then(success => console.log('suc', success))
      .catch(err => console.log(err));
  };

  const _renderImage = ({uri = null} = {}) => {
    return (
      <View
        style={{
          alignItems: 'center',
          alignSelf: 'flex-start',
          marginTop: 10,
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
        </View>
      </View>
    );
  };

  return (
    <Wrapper>
      <Header back title={'Detail Teknisi'} />
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View
          style={{
            borderWidth: 0.6,
            borderColor: colors.grey,
            margin: 5,
            padding: 15,
            borderRadius: 5,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {item?.verified ? (
              <MI
                name={'verified-user'}
                size={22}
                color={colors.primary}
                style={{marginRight: 5}}
              />
            ) : null}

            <Text size={18} bold style={{color: colors.primary}}>
              {item?.name}
            </Text>
          </View>

          <View style={{marginTop: 10}}>
            <Text>Email:</Text>
            <Text bold>{item?.email}</Text>
          </View>

          <View style={{marginTop: 10}}>
            <Text>Alamat:</Text>
            <Text bold>{item?.address}</Text>
          </View>

          <View style={{marginTop: 10}}>
            <Text>No. HP:</Text>
            <Text bold>{item?.phone}</Text>
          </View>

          <View style={{marginTop: 16}}>
            <Text>Keahlian:</Text>
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
            <Text>Foto Identitas:</Text>
            {_renderImage({uri: doc?.ktp})}
          </View>

          <View style={{marginTop: 10}}>
            <Text>Foto Bersama Kartu Identitas:</Text>
            {_renderImage({uri: doc?.selfie})}
          </View>

          <View style={{marginTop: 10}}>
            <Text>Foto Usaha:</Text>
            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
              {doc?.usaha.map((k, i) => {
                return (
                  <View key={i} style={{marginRight: 8}}>
                    {_renderImage({uri: k})}
                  </View>
                );
              })}
            </View>
          </View>

          <View
            style={{
              marginTop: 10,
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}>
            <TouchableOpacity
              onPress={_wa}
              style={{
                backgroundColor: colors.white,
                width: 50,
                height: 50,
                borderRadius: 50 / 2,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <MCI name={'whatsapp'} size={30} color="#25D366" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={_location}
              style={{
                backgroundColor: colors.white,
                width: 50,
                height: 50,
                borderRadius: 50 / 2,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <MCI name={'map-marker'} size={30} color="#f44546" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {!item?.verified && (
        <View style={{flexDirection: 'row'}}>
          <Button
            loading={load2}
            onPress={() => _tolak()}
            style={{borderRadius: 0, width: '50%', paddingVertical: 16}}
            bgMain={colors.orange}
            bgLoading={'rgba(240,131,0,0.4)'}>
            Tolak
          </Button>
          <Button
            style={{borderRadius: 0, width: '50%', paddingVertical: 16}}
            loading={load1}
            onPress={() => _terima()}>
            Terima
          </Button>
        </View>
      )}
    </Wrapper>
  );
};

export default detail;

const styles = StyleSheet.create({});
