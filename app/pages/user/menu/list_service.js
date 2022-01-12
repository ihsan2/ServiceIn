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
import {MI, MCI} from '../../../assets/icons/index';
import * as colors from '../../../styles/colors';
import Header from '../../../components/header';

const list = ({navigation, route}) => {
  const {item, list} = route.params;

  return (
    <Wrapper>
      <Header back title={'Daftar Teknisi'} />
      <ScrollView style={styles.body}>
        <View
          style={{
            backgroundColor: colors.lightGrey,
            paddingHorizontal: 20,
            paddingVertical: 15,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <MCI
            name={item.icon}
            color={colors.primary}
            size={20}
            style={{marginRight: 10}}
          />
          <Text bold>{item.name}</Text>
        </View>
        <View style={{margin: 20}}>
          {list.map(k => {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('DetailTeknisi', {item: k, data: item})
                }
                key={k.uid}
                style={{
                  borderWidth: 0.5,
                  borderRadius: 10,
                  borderColor: colors.grey,
                  marginBottom: 15,
                }}>
                <Image
                  source={{uri: k.img[0]}}
                  style={{
                    height: 150,
                    width: '100%',
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                  }}
                />
                <View style={{padding: 15}}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <MI
                      name={'verified-user'}
                      size={20}
                      color={colors.primary}
                    />
                    <Text size={16} bold style={{marginLeft: 5}}>
                      {k.name} ({k.distance} km)
                    </Text>
                  </View>
                  <Text style={{marginTop: 5}}>{k.address}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </Wrapper>
  );
};

export default list;

const styles = StyleSheet.create({
  body: {flex: 1},
});
