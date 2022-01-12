import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {MCI} from '../../assets/icons/';
import * as colors from '../../styles/colors';
import Geocoder from 'react-native-geocoding';
import Geolocation from '@react-native-community/geolocation';
import Text from '../../components/text';
import Button from '../../components/button';

Geocoder.init('AIzaSyDh0_cYDi7QnGOaXyax9jN2gdeD-X5jDR0');

const main = ({navigation, route}) => {
  const {latitude, longitude, onPress} = route.params;

  const [lat, setLat] = useState(latitude);
  const [lng, setLng] = useState(longitude);
  const [address, setAddress] = useState('');

  useEffect(() => {
    _getAddress(lat, lng);
  }, [route]);

  const _getAddress = (x, y) => {
    Geocoder.from({
      latitude: x,
      longitude: y,
    }).then(info => setAddress(info.results[0].formatted_address));
  };

  return (
    <View style={{flex: 1}}>
      <MapView
        onRegionChange={e => {
          setLat(e.latitude);
          setLng(e.longitude);
        }}
        onRegionChangeComplete={e => {
          _getAddress(e.latitude, e.longitude);
        }}
        provider={PROVIDER_GOOGLE}
        style={{flex: 1}}
        showsMyLocationButton={true}
        initialRegion={{
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}>
        <Marker
          title={'Lokasi Saya'}
          identifier={'mark'}
          coordinate={{
            latitude: lat,
            longitude: lng,
          }}>
          <MCI size={36} color={colors.red} name={'map-marker'} />
        </Marker>
      </MapView>
      <View
        style={{
          backgroundColor: colors.white,
          position: 'absolute',
          width: '100%',
          bottom: 0,
          paddingVertical: 15,
          paddingHorizontal: 20,
        }}>
        <Text style={{color: colors.primary}}>
          Apakah benar anda berada di sekitar daerah ini?
        </Text>
        <Text style={{marginTop: 5}}>{address}</Text>
        <Button
          fullWidth
          style={{marginTop: 10}}
          onPress={() => {
            onPress(lat, lng);
            navigation.goBack();
          }}>
          Yap
        </Button>
      </View>
    </View>
  );
};

export default main;
