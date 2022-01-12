import React from 'react';
import {View, Text} from 'react-native';
import {Appbar} from 'react-native-paper';
import * as colors from '../../styles/colors';
import {useNavigation} from '@react-navigation/native';

const menu = ({title, back}) => {
  const navigation = useNavigation();
  return (
    <View>
      <Appbar.Header
        style={{
          backgroundColor: colors.primary,
          justifyContent: 'center',
        }}>
        {back ? (
          <Appbar.BackAction
            onPress={() => navigation.goBack(null)}
            color={colors.white}
          />
        ) : null}
        <Appbar.Content
          title={title}
          titleStyle={{alignSelf: 'center'}}
          titleStyle={{alignSelf: 'center', color: colors.white}}
        />
        {back ? (
          <Appbar.BackAction color={colors.primary} onPress={() => {}} />
        ) : null}
      </Appbar.Header>
    </View>
  );
};

export default menu;
