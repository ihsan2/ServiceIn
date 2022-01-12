import React, {useState} from 'react';
import {StyleSheet, Platform, View, TouchableOpacity} from 'react-native';
import {Ionicons} from '../../assets/icons';
import * as colors from '../../styles/colors';
import Input from './main';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const date = props => {
  const {style, refComponent, setDate, value, mode} = props;
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  let modeDate = mode ? 'date' : mode;

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    setDate(date);
    hideDatePicker();
  };

  return (
    <TouchableOpacity
      onPress={() => showDatePicker()}
      style={[styles.password, style ? style : {}]}>
      <Input {...props} refComponent={refComponent} editable={false} />
      <TouchableOpacity style={styles.icon} disabled>
        <Ionicons
          name={'calendar-outline'}
          style={styles.eye}
          color={colors.primary}
          size={18}
        />
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode={mode ? mode : 'date'}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        // date={value ? new Date(value) : new Date()}
      />
    </TouchableOpacity>
  );
};

export default date;

const styles = StyleSheet.create({
  password: {
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    right: 10,
    top: 14,
  },
  eye: {
    color: colors.primary,
  },
});
