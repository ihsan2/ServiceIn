import React from 'react';
import {View, Image} from 'react-native';
import Text from '../../components/text';
import * as colors from '../../styles/colors';

const index = props => {
  const {desc, style} = props;
  return (
    <View style={style ? style : {}}>
      <Image
        source={require('../../assets/images/emp.png')}
        style={{
          resizeMode: 'contain',
          height: 200,
          width: 200,
          alignSelf: 'center',
        }}
      />
      <Text center style={{fontSize: 18, marginTop: 10, color: colors.black}}>
        {desc}
      </Text>
    </View>
  );
};

export default index;
