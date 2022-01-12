import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Ionicons} from '../../assets/icons';
import * as colors from '../../styles/colors';
import Input from './main';
import ModalPick from '../modal/picker';

const picker = props => {
  const {
    style,
    refComponent,
    title,
    setValue,
    value,
    data,
    close,
    open,
    visible,
  } = props;
  return (
    <TouchableOpacity
      style={[styles.picker, style ? style : {}]}
      onPress={open}>
      <Input {...props} refComponent={refComponent} editable={false} />
      <TouchableOpacity style={styles.icon} disabled>
        <Ionicons
          name={'chevron-down'}
          style={styles.down}
          color={colors.primary}
          size={18}
        />
      </TouchableOpacity>
      <ModalPick
        title={title}
        close={close}
        visible={visible}
        data={data}
        value={value}
        setValue={setValue}
      />
    </TouchableOpacity>
  );
};

export default picker;

const styles = StyleSheet.create({
  picker: {
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    right: 10,
    top: 14,
  },
  down: {
    color: colors.primary,
  },
});
