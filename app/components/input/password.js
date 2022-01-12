import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Ionicons} from '../../assets/icons';
import * as colors from '../../styles/colors';
import Input from './main';

const pass = props => {
  const {style, refComponent} = props;
  const [hidden, setHidden] = useState(true);
  return (
    <View style={[styles.password, style ? style : {}]}>
      <Input {...props} refComponent={refComponent} secureTextEntry={hidden} />
      <TouchableOpacity style={styles.icon} onPress={() => setHidden(!hidden)}>
        {hidden ? (
          <Ionicons
            name={'eye'}
            style={styles.eye}
            color={colors.primary}
            size={18}
          />
        ) : (
          <Ionicons
            name={'eye-off'}
            style={styles.eye}
            color={colors.primary}
            size={18}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default pass;

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
