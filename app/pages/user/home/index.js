import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

import MenuPage from '../menu';
import OrderPage from '../order';
import ProfilePage from '../profile';
import {View} from 'react-native';
import {MCI} from '../../../assets/icons';
import Text from '../../../components/text';
import * as colors from '../../../styles/colors';
import {useDispatch, useSelector} from 'react-redux';
import {getUser} from '../../../redux/actions/user';
import messaging from '@react-native-firebase/messaging';
import database from '@react-native-firebase/database';
import {getOrders} from '../../../redux/actions/order';
import Toast from 'react-native-toast-message';
import Sound from 'react-native-sound';

const HomeUser = ({navigation}) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.userState.user);

  useEffect(async () => {
    _updateToken();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      _playSound();
      Toast.show({
        type: 'notif',
        text1: remoteMessage.notification.title,
        text2: remoteMessage.notification.body,
        visibilityTime: 4000,
        topOffset: 15,
        onPress: () => {
          _click(remoteMessage);
          Toast.hide();
        },
      });
    });

    messaging().onNotificationOpenedApp(rm => {
      navigation.navigate(rm?.data?.parent, {screen: rm?.data?.link});
      dispatch(getOrders(user?.uid));
    });

    messaging()
      .getInitialNotification()
      .then(rm => {
        if (rm) {
          navigation.navigate(rm?.data?.parent, {screen: rm?.data?.link});
          dispatch(getOrders(user?.uid));
        }
      });

    return unsubscribe;
  }, []);

  const _click = rm => {
    navigation.navigate(rm?.data?.parent, {screen: rm?.data?.link});
    dispatch(getOrders(user?.uid));
  };

  const _updateToken = async () => {
    const fcmToken = await messaging().getToken();
    database()
      .ref(`/users/${user.uid}`)
      .update({device_id: fcmToken})
      .then(() => {
        dispatch(getUser(user.uid));
      });
  };

  useEffect(() => {
    dispatch(getUser(user.uid));
  }, []);

  const _playSound = () => {
    var notifSound = new Sound('notif.mp3', Sound.MAIN_BUNDLE, error => {
      notifSound.play();
    });
  };

  return (
    <Tab.Navigator tabBarOptions={{style: {height: 54}}}>
      <Tab.Screen
        name="Home"
        component={MenuPage}
        options={{
          title: 'Home',
          tabBarIcon: ({focused}) => (
            <IconTab ic={'home'} cl={focused ? colors.primary : colors.grey} />
          ),
          tabBarLabel: ({focused}) => (
            <LabelTab tx={'Home'} cl={focused ? colors.primary : colors.grey} />
          ),
        }}
      />
      <Tab.Screen
        name="Order"
        component={OrderPage}
        options={{
          title: 'Order',
          tabBarIcon: ({focused}) => (
            <IconTab
              ic={'clipboard-list-outline'}
              cl={focused ? colors.primary : colors.grey}
            />
          ),
          tabBarLabel: ({focused}) => (
            <LabelTab
              tx={'Order'}
              cl={focused ? colors.primary : colors.grey}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Akun"
        component={ProfilePage}
        options={{
          title: 'Akun',
          tabBarIcon: ({focused}) => (
            <IconTab
              ic={'account'}
              cl={focused ? colors.primary : colors.grey}
            />
          ),
          tabBarLabel: ({focused}) => (
            <LabelTab tx={'Akun'} cl={focused ? colors.primary : colors.grey} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default HomeUser;

const IconTab = ({ic, cl}) => {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: cl,
        width: 30,
        height: 30,
        borderRadius: 30 / 2,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <MCI name={ic} color={cl} size={20} />
    </View>
  );
};

const LabelTab = ({tx, cl}) => {
  return <Text style={{color: cl, fontSize: 12, marginBottom: 2}}>{tx}</Text>;
};
