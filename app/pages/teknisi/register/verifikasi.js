import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import Wrapper from '../../../components/wrapper';
import Text from '../../../components/text';
import {AD, MCI} from '../../../assets/icons/index';
import Button from '../../../components/button';
import * as colors from '../../../styles/colors';
import ModalUpload from '../../../components/modal/upload';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';
import {showAlert} from '../../../alert';
import {useDispatch} from 'react-redux';
import {getUsers} from '../../../redux/actions/user';

const verifikasi = ({navigation, route}) => {
  const [v1, setV1] = useState(false);
  const [v2, setV2] = useState(false);
  const [v3, setV3] = useState(false);
  const [f1, setF1] = useState(null);
  const [f2, setF2] = useState(null);
  const [f3, setF3] = useState([]);
  const [load, setLoad] = useState(false);
  const dispatch = useDispatch();

  let {uid} = route.params;

  const _save = async () => {
    let empty = !f1 || !f2 || f3.length === 0;

    if (empty) {
      showAlert({text: 'Semua data wajib diisi.', type: 'error'});
      return;
    }

    setLoad(true);

    await storage().ref(`foto-ktp/${uid}.jpg`).putFile(f1[0].uri);
    let ktpUrl = await storage().ref(`foto-ktp/${uid}.jpg`).getDownloadURL();
    await storage().ref(`foto-selfie/${uid}.jpg`).putFile(f2[0].uri);
    let selfieUrl = await storage()
      .ref(`foto-selfie/${uid}.jpg`)
      .getDownloadURL();

    let d = [];
    for (let i in f3) {
      await storage().ref(`foto-usaha/${uid}-${i}.jpg`).putFile(f3[i].uri);
      let y = await storage()
        .ref(`foto-usaha/${uid}-${i}.jpg`)
        .getDownloadURL();
      d.push(y);
    }

    let data = {
      ktp: ktpUrl,
      selfie: selfieUrl,
      usaha: d,
    };

    await database()
      .ref(`/document/${uid}`)
      .set(data)
      .then(() => {
        database()
          .ref(`/users/${uid}`)
          .update({isUpload: true})
          .then(() => {
            showAlert({text: 'Dokumen berhasil dikirim.'});
            navigation.replace('Success');
            setLoad(false);
            dispatch(getUsers());
          });
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

  return (
    <Wrapper>
      <ScrollView style={styles.body}>
        <ModalUpload
          title={'Foto Kartu Identitas'}
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
        <ModalUpload
          title={'Foto Bersama Kartu Identitas'}
          closeModal={() => setV2(false)}
          visible={v2}
          selectGalery={() => {
            launchImageLibrary(
              {
                mediaType: 'photo',
              },
              res => {
                setV2(false);
                setF2(res?.assets);
              },
            );
          }}
          selectCamera={() => {
            launchCamera(
              {
                mediaType: 'photo',
              },
              res => {
                setV2(false);
                setF2(res?.assets);
              },
            );
          }}
        />
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
        <View style={{marginVertical: 20}}>
          <TouchableOpacity
            onPress={() => navigation.replace('Login')}
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
            Verifikasi Teknisi
          </Text>
        </View>
        <View style={{width: '100%', marginBottom: 20}}>
          <Text style={{marginBottom: 4}} bold>
            Kartu Identitas
          </Text>
          <Text style={{marginBottom: 8}}>
            Foto kartu identitas anda (KTP/SIM) dengan jelas agar memudahkan
            proses verifikasi.
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
        <View style={{width: '100%', marginBottom: 20}}>
          <Text style={{marginBottom: 4}} bold>
            Foto Bersama Kartu Identitas
          </Text>
          <Text style={{marginBottom: 8}}>
            Foto diri anda dengan memegang kartu identitas.
          </Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: colors.grey,
              borderRadius: 5,
              padding: 20,
            }}>
            {f2 ? (
              _renderImage({uri: f2[0].uri, close: () => setF2(null)})
            ) : (
              <TouchableOpacity
                onPress={() => setV2(true)}
                style={{alignItems: 'center'}}>
                <MCI name="upload-outline" color={colors.grey} size={60} />
                <Text color={colors.grey} bold>
                  Upload Foto
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={{width: '100%'}}>
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
      </ScrollView>
      <View style={{paddingTop: 10, backgroundColor: 'transparent'}}>
        <Button
          loading={load}
          fullWidth
          onPress={_save}
          style={{borderRadius: 0, paddingVertical: 20}}>
          Kirim
        </Button>
      </View>
    </Wrapper>
  );
};

export default verifikasi;

const styles = StyleSheet.create({
  body: {flex: 1, paddingHorizontal: 20},
});
