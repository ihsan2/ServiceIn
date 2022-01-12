import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import {AD} from '../../assets/icons';

const index = ({route, navigation}) => {
  return (
    <View style={{backgroundColor: '#fff'}}>
      <Image
        source={{
          uri: route.params?.uri,
        }}
        style={{resizeMode: 'contain', width: '100%', height: '100%'}}
      />
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          width: 48,
          height: 48,
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          backgroundColor: 'rgba(0,0,0,0.2)',
          borderRadius: 48 / 2,
          top: 15,
          left: 15,
        }}>
        <AD name={'left'} size={26} color={'#fff'} />
      </TouchableOpacity>
    </View>
  );
};

export default index;
