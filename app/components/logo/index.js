import React from 'react';
import {View, Image} from 'react-native';

const index = ({style}) => {
  return (
    <View>
      <Image
        style={[{resizeMode: 'contain'}, style ? style : {}]}
        source={require('../../assets/images/logo1.png')}
      />
    </View>
  );
};

export default index;
