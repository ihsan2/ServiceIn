import React from 'react';
import {View, Modal, ScrollView, TouchableOpacity} from 'react-native';
import Wrapper from '../../components/wrapper';
import Header from '../../components/header/modal';
import Text from '../text';
import * as colors from '../../styles/colors';

const picker = ({title, visible, close, data, value, setValue}) => {
  return (
    <View>
      <Modal visible={visible}>
        <Wrapper>
          <View>
            <Header title={title} close={close} />
            <ScrollView contentContainerStyle={{paddingBottom: 10}}>
              {data?.map((item, key) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setValue(item);
                      close();
                    }}
                    key={key}
                    style={{
                      paddingHorizontal: 20,
                      paddingVertical: 15,
                      borderBottomWidth: 0.8,
                      borderBottomColor: colors.grey,
                    }}>
                    <Text bold={value === item ? true : false}>
                      {item?.provinsi ? item?.provinsi : item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </Wrapper>
      </Modal>
    </View>
  );
};

export default picker;
