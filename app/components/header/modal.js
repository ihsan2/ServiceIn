import React from 'react';
import {View, Text} from 'react-native';
import {Appbar} from 'react-native-paper';
import * as colors from '../../styles/colors';
import {useNavigation} from '@react-navigation/native';

const menu = ({title, close}) => {
  const navigation = useNavigation();
  return (
    <View>
      <Appbar.Header
        style={{
          backgroundColor: colors.primary,
          justifyContent: 'center',
        }}>
        <Appbar.Action
          icon="close"
          onPress={() => close()}
          color={colors.white}
        />
        <Appbar.Content
          title={title}
          titleStyle={{alignSelf: 'center', color: colors.white}}
        />
        <Appbar.Action icon="close" onPress={() => {}} color={colors.primary} />
      </Appbar.Header>
    </View>
  );
};

export default menu;
