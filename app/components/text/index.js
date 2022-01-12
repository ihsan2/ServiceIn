import React from 'react';
import {Text, StyleSheet} from 'react-native';

const index = props => {
  const {bold, center, children, style, size} = props;
  return (
    <Text
      {...props}
      style={[
        styles.text,
        bold ? {fontWeight: 'bold'} : {},
        center ? {textAlign: 'center'} : {},
        size ? {fontSize: size} : {},
        style ? style : {},
      ]}>
      {children}
    </Text>
  );
};

export default index;

const styles = StyleSheet.create({
  text: {
    color: '#000',
  },
  textBold: {
    fontWeight: 'bold',
  },
});
