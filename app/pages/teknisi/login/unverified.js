import React from 'react';
import {View, StyleSheet, Image, ScrollView} from 'react-native';
import Wrapper from '../../../components/wrapper';
import Text from '../../../components/text';
import Button from '../../../components/button';
import * as colors from '../../../styles/colors';

const unverified = ({navigation}) => {
  return (
    <Wrapper>
      <ScrollView style={styles.body} contentContainerStyle={{flexGrow: 1}}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: -100,
            paddingHorizontal: 20,
          }}>
          <Text style={{marginBottom: 8}} center size={20}>
            Maaf, Anda belum bisa login. Akun anda masih dalam proses
            verifikasi.
          </Text>
          <Image
            source={require('../../../assets/images/emp.png')}
            style={{resizeMode: 'contain', height: 240, width: 240}}
          />
          <Text style={{marginBottom: 8}} center size={16}>
            Silahkan menunggu proses verifikasi oleh tim Kami. Informasi
            aktivasi akun akan dikirim melalui Email.
          </Text>

          <View style={{marginTop: 16, width: '100%'}}>
            <Button
              onPress={() => navigation.replace('Login')}
              style={{borderRadius: 50, width: '50%'}}>
              Kembali
            </Button>
          </View>
        </View>
      </ScrollView>
    </Wrapper>
  );
};

export default unverified;

const styles = StyleSheet.create({
  body: {flex: 1, paddingHorizontal: 20},
});
