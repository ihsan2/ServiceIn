import React, {Component} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {WebView} from 'react-native-webview';

class MyInlineWeb extends Component {
  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <WebView
          style={{flex: 1}}
          originWhitelist={['*']}
          source={{uri: this.props?.route?.params?.url}}
        />
      </SafeAreaView>
    );
  }
}

export default MyInlineWeb;
