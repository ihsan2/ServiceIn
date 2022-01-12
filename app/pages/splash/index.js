import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import Logo from '../../components/logo';
import {Chase} from 'react-native-animated-spinkit';
import Wrapper from '../../components/wrapper';
import * as colors from '../../styles/colors';
import Geolocation from '@react-native-community/geolocation';
import {useSelector} from 'react-redux';

const index = ({navigation}) => {
  const user = useSelector(state => state.userState.user);

  useEffect(() => {
    _getLocation();
    _start();
  }, []);

  const _start = () => {
    setTimeout(() => {
      if (user) {
        if (user?.role === 'user') {
          navigation.replace('HomeUser');
        } else if (user?.role === 'admin') {
          navigation.replace('AdminHome');
        } else {
          navigation.replace('Home');
        }
      } else {
        navigation.replace('OnBoarding');
      }
    }, 1000);
  };

  const _getLocation = () => {
    Geolocation.getCurrentPosition(info => {});
  };

  return (
    <Wrapper>
      <View style={styles.body}>
        <Logo />
        <Chase style={styles.load} color={colors.primary} />
      </View>
    </Wrapper>
  );
};

export default index;

const styles = StyleSheet.create({
  body: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  load: {position: 'absolute', bottom: 80},
});
