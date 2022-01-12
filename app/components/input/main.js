import React from 'react';
import {TextInput, StyleSheet} from 'react-native';
import * as colors from '../../styles/colors';

const main = props => {
  const {style, refComponent, multiline} = props;
  return (
    <TextInput
      {...props}
      ref={refComponent}
      textAlignVertical={multiline ? 'top' : 'center'}
      placeholderTextColor={colors.darkGrey}
      style={[
        styles.textInput,
        multiline ? styles.multiline : {},
        style ? style : {},
        props.editable ? {color: colors.black} : {color: colors.black},
      ]}
    />
  );
};

export default main;

const styles = StyleSheet.create({
  textInput: {
    width: '100%',
    backgroundColor: colors.white,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.grey,
    height: 48,
  },
  multiline: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.grey,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 20,
    minHeight: 100,
  },
});

main.defaultProps = {
  secureTextEntry: false,
};
