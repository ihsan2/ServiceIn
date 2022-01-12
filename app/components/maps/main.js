import React from 'react';
import {View} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {MCI} from '../../assets/icons/';
import * as colors from '../../styles/colors';

const main = ({lat, lng}) => {
  return (
    <View style={{flex: 1}}>
      <MapView
        scrollEnabled={false}
        provider={PROVIDER_GOOGLE}
        style={{flex: 1}}
        showsMyLocationButton={true}
        // initialRegion={{
        //   latitude: lat,
        //   longitude: lng,
        //   latitudeDelta: 0.01,
        //   longitudeDelta: 0.01,
        // }}
        camera={{
          center: {latitude: lat, longitude: lng},
          pitch: 0,
          zoom: 15,
          heading: 0,
          altitude: 0,
        }}
        initialCamera={{
          center: {latitude: lat, longitude: lng},
          pitch: 0,
          zoom: 15,
          heading: 0,
          altitude: 0,
        }}>
        <Marker
          identifier={'mk'}
          title={'Lokasi Saya'}
          coordinate={{
            latitude: lat,
            longitude: lng,
          }}>
          <MCI size={36} color={colors.red} name={'map-marker'} />
        </Marker>
      </MapView>
    </View>
  );
};

export default main;
