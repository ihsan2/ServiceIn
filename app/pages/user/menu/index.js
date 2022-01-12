import React, {useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import Text from '../../../components/text';
import Wrapper from '../../../components/wrapper';
import * as colors from '../../../styles/colors';
import Search from '../../../components/input/search';
import {MCI} from '../../../assets/icons';
import {menu} from '../../../dummy';
import {useNavigation} from '@react-navigation/native';

const index = () => {
  const [data, setData] = useState(menu);
  const navigation = useNavigation();

  return (
    <Wrapper>
      <View style={{backgroundColor: colors.primary, padding: 20}}>
        <Search
          placeholder={'Mau Service apa hari ini?'}
          onChangeText={x => {
            let res = menu.filter(k =>
              k.name.toLowerCase().match(x.toLowerCase()),
            );
            setData(res);
          }}
        />
      </View>
      <View
        style={{
          marginVertical: 20,
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}>
        {data.map((k, i) => {
          return (
            <TouchableOpacity
              onPress={() => navigation.navigate('FormOrder', {item: k})}
              key={i}
              style={{
                backgroundColor: colors.lightGrey,
                paddingVertical: 10,
                borderWidth: 0.5,
                borderColor: colors.grey,
                borderRadius: 4,
                width: '25%',
                marginLeft: i % 3 === 0 ? 20 : 30,
                marginBottom: 20,
                alignItems: 'center',
              }}>
              <MCI
                name={k.icon}
                color={colors.primary}
                size={36}
                style={{marginBottom: 10}}
              />
              <Text>{k.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </Wrapper>
  );
};

export default index;
