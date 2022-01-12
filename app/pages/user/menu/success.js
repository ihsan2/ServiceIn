import React from 'react';
import {View, StyleSheet, Image, ScrollView} from 'react-native';
import Wrapper from '../../../components/wrapper';
import Text from '../../../components/text';
import Button from '../../../components/button';
import * as colors from '../../../styles/colors';

const success = ({navigation}) => {
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
            Terimakasih anda telah melakukan pemesanan.
          </Text>
          <Image
            source={require('../../../assets/images/success.png')}
            style={{resizeMode: 'contain', height: 240, width: 240}}
          />
          <Text style={{marginBottom: 8}} center size={16}>
            Silahkan menunggu persetujuan dari teknisi.
          </Text>

          <View style={{marginTop: 16, width: '100%'}}>
            <Button
              onPress={() => navigation.navigate('Order', {screen: 'Berjalan'})}
              style={{borderRadius: 50, width: '50%'}}>
              Lihat Pesanan
            </Button>
          </View>
        </View>
      </ScrollView>
    </Wrapper>
  );
};

export default success;

const styles = StyleSheet.create({
  body: {flex: 1, paddingHorizontal: 20},
});
