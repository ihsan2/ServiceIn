import React, {Component} from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import * as colors from '../../styles/colors';

export default class ASIWrapper extends Component {
  render() {
    return (
      <SafeAreaView style={styles.wrapper}>
        <StatusBar
          // translucent={true}
          barStyle="light-content"
          backgroundColor={colors.primary}
        />
        {this.props.children}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
