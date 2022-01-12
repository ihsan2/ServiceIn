import React, {useState} from 'react';
import {StyleSheet, Platform, View, TouchableOpacity} from 'react-native';
import {Ionicons} from '../../assets/icons';
import * as colors from '../../styles/colors';
import Input from './main';

const main = props => {
  const {style, refComponent} = props;
  return (
    <View style={[styles.password, style ? style : {}]}>
      <Input {...props} refComponent={refComponent} style={{paddingLeft: 45}} />
      <TouchableOpacity style={styles.icon} disabled>
        <Ionicons
          name={'search'}
          style={styles.search}
          color={colors.primary}
          size={18}
        />
      </TouchableOpacity>
    </View>
  );
};

export default main;

const styles = StyleSheet.create({
  password: {
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    left: 15,
    top: 14,
  },
  search: {
    color: colors.primary,
  },
});
