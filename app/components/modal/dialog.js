import React from 'react';
import {View} from 'react-native';
import Modal from 'react-native-modal';
import * as colors from '../../styles/colors';
import Text from '../../components/text/';
import Btn from '../../components/button';
import {MCI} from '../../assets/icons';

const dialog = ({isVisible, closeModal, onSubmit, message, children}) => {
  return (
    <View>
      <Modal isVisible={isVisible} onBackdropPress={closeModal}>
        <View
          style={{
            backgroundColor: colors.lightBlue,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.blue,
            paddingVertical: 20,
            paddingHorizontal: 20,
          }}>
          <View
            style={{
              width: 48,
              height: 48,
              borderWidth: 1.5,
              borderRadius: 48 / 2,
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: colors.grey,
              marginBottom: 20,
              alignSelf: 'center',
            }}>
            <MCI name={'information-variant'} size={40} color={colors.grey} />
          </View>
          <Text center style={{fontSize: 16}}>
            {message}
          </Text>
          <View>{children}</View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 30,
              justifyContent: 'center',
            }}>
            <Btn
              onPress={closeModal}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 15,
                marginRight: 15,
                width: 80,
              }}
              bgMain={colors.orange}>
              Tidak
            </Btn>
            <Btn
              onPress={() => {
                onSubmit();
                closeModal();
              }}
              style={{paddingVertical: 10, paddingHorizontal: 15, width: 80}}
              bgMain={colors.green}>
              Ya
            </Btn>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default dialog;
