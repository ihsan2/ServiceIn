import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import Text from '../text';
import * as colors from '../../styles/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

const index = ({
  children,
  fullWidth,
  style,
  onPress,
  loading,
  bgMain,
  bgLoading,
  disabled,
  icon,
  color,
}) => {
  if (icon) {
    return (
      <TouchableOpacity
        disabled={disabled}
        onPress={onPress}
        style={[
          styles.button,
          fullWidth ? {width: '100%'} : {},
          style ? style : {},
          {backgroundColor: loading ? bgLoading : bgMain},
        ]}>
        {loading ? (
          <ActivityIndicator color={'#fff'} />
        ) : (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Ionicons
              name="add"
              color={colors.white}
              size={20}
              style={{marginRight: 5}}
            />
            <Text bold style={[styles.caption, color ? {color: color} : {}]}>
              {children}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.button,
        fullWidth ? {width: '100%'} : {},
        style ? style : {},
        {backgroundColor: loading ? bgLoading : bgMain},
      ]}>
      {loading ? (
        <ActivityIndicator color={'#fff'} />
      ) : (
        <Text bold style={[styles.caption, color ? {color: color} : {}]}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default index;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignSelf: 'center',
    alignItems: 'center',
    fontSize: 16,
  },
  caption: {
    color: colors.white,
  },
});

index.defaultProps = {
  fullWidth: false,
  style: {},
  loading: false,
  bgLoading: 'rgba(28, 180, 255, 0.4)',
  bgMain: colors.primary,
};
