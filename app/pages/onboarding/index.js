import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, Dimensions} from 'react-native';
import Wrapper from '../../components/wrapper';
import * as colors from '../../styles/colors';
import Text from '../../components/text';
import {intro} from '../../dummy';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import Button from '../../components/button';
import {useDispatch} from 'react-redux';
import {setRole} from '../../redux/actions/user';
import messaging from '@react-native-firebase/messaging';

let width = Dimensions.get('window').width;

const index = ({navigation}) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const dispatch = useDispatch();

  const _renderItem = ({item}) => {
    return (
      <View
        style={{
          alignItems: 'center',
          paddingHorizontal: 36,
        }}>
        <Image
          source={item?.img}
          style={{resizeMode: 'contain', height: 300, width: 300}}
        />
        <Text center bold size={20} style={{marginBottom: 10}}>
          {item?.title}
        </Text>
        <Text size={16} center>
          {item?.text}
        </Text>
      </View>
    );
  };

  const _pagination = () => {
    return (
      <Pagination
        dotsLength={intro.length}
        activeDotIndex={activeSlide}
        containerStyle={styles.carouselPagination}
        dotStyle={styles.slidePaginationDotStyle}
        inactiveDotStyle={styles.slidePaginationDotStyleInactive}
        inactiveDotOpacity={1}
        inactiveDotScale={1}
      />
    );
  };

  return (
    <Wrapper>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <View>
          <Carousel
            style={styles.carousel}
            data={intro}
            renderItem={_renderItem}
            sliderWidth={width}
            itemWidth={width}
            inactiveSlideScale={1}
            onSnapToItem={index => setActiveSlide(index)}
          />
          <View style={{marginTop: 20}}>{_pagination()}</View>
        </View>
        <View style={{paddingHorizontal: 20, marginTop: 36}}>
          <Button
            onPress={() => {
              navigation.navigate('LoginUser');
              dispatch(setRole('user'));
            }}
            color={colors.primary}
            bgMain={'#fff'}
            fullWidth
            style={{
              borderRadius: 50,
              marginBottom: 10,
              borderWidth: 1.5,
              borderColor: colors.primary,
            }}>
            User
          </Button>
          <Button
            onPress={() => {
              navigation.navigate('Login');
              dispatch(setRole('teknisi'));
            }}
            fullWidth
            style={{
              borderRadius: 50,
              borderWidth: 1.5,
              borderColor: colors.primary,
            }}>
            Teknisi
          </Button>
        </View>
      </View>
    </Wrapper>
  );
};

export default index;

const styles = StyleSheet.create({
  carousel: {
    flexGrow: 0,
    marginBottom: 30,
  },
  carouselPagination: {
    paddingVertical: 0,
  },
  slidePaginationDotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 2,
    backgroundColor: colors.primary,
  },
  slidePaginationDotStyleInactive: {
    backgroundColor: colors.white,
    borderColor: colors.grey,
    borderWidth: 1,
  },
});
