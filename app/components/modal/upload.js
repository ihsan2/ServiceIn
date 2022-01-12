import React, {Component} from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
} from 'react-native';
import {MCI} from '../../assets/icons';
import * as colors from '../../styles/colors';

export default class Upload extends Component {
  render() {
    const {selectGalery, selectCamera, closeModal, title} = this.props;
    return (
      <View>
        <Modal
          {...this.props}
          animationType="fade"
          transparent={true}
          onRequestClose={closeModal}>
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.allContent}>
              <TouchableWithoutFeedback>
                <View style={styles.content}>
                  <Text style={styles.type}>{title}</Text>
                  <View style={styles.groupIcon}>
                    <TouchableWithoutFeedback onPress={selectGalery}>
                      <View style={styles.iconText}>
                        <View style={styles.icon}>
                          <MCI
                            name={'image-outline'}
                            size={18}
                            color={'#fff'}
                          />
                        </View>
                        <Text style={styles.text}>Galeri</Text>
                      </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={selectCamera}>
                      <View style={styles.iconText}>
                        <View style={styles.icon}>
                          <MCI
                            name={'camera-outline'}
                            size={18}
                            color={'#fff'}
                          />
                        </View>
                        <Text style={styles.text}>Kamera</Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  allContent: {
    backgroundColor: 'rgba(0,0,0,0.82)',
    flex: 1,
    justifyContent: 'flex-end',
    height: '100%',
  },
  content: {
    backgroundColor: '#fff',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  type: {
    fontSize: 20,
    fontWeight: '400',
    marginBottom: 16,
  },
  groupIcon: {
    flexDirection: 'row',
    marginLeft: 16,
  },
  iconText: {
    marginRight: 36,
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 50,
  },
  text: {
    fontSize: 16,
    marginTop: 8,
    color: 'gray',
  },
});
