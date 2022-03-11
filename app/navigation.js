// In App.js in a new project

import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
const Stack = createStackNavigator();
import {MainMenu} from './tabs';

// import screen
// Splash
import SplashPage from './pages/splash';

// OnBoard
import OnBoardingPage from './pages/onboarding';

// User
import LoginUserPage from './pages/user/login';
import RegisterUserPage from './pages/user/register';
import HomeUserPage from './pages/user/home';
import FormOrderPage from './pages/user/menu/form';
import ListServicePage from './pages/user/menu/list_service';
import DetailTeknisiPage from './pages/user/menu/detail';
import SuccessOrderPage from './pages/user/menu/success';
import DetailOrder from './pages/user/order/detail';
import EditProfileUserPage from './pages/user/profile/edit';

// Teknisi
import LoginPage from './pages/teknisi/login';
import UnVerif from './pages/teknisi/login/unverified';
import RegisterPage from './pages/teknisi/register';
import VerifikasiPage from './pages/teknisi/register/verifikasi';
import SuccessPage from './pages/teknisi/register/success';
import HomePage from './pages/teknisi/home';
import DetailOrderTeknisi from './pages/teknisi/order/detail';
import EditProfilePage from './pages/teknisi/profile/edit';

// Admin
import AdminHome from './pages/user/admin';
import AdminDetail from './pages/user/admin/detail';

// Image
import ImagePage from './pages/image';

// WebView
import WebView from './pages/webview';

// Maps
import MapsPage from './pages/maps';

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Splash"
          component={SplashPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="OnBoarding"
          component={OnBoardingPage}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="LoginUser"
          component={LoginUserPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="RegisterUser"
          component={RegisterUserPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="HomeUser"
          component={HomeUserPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DetailOrderTeknisi"
          component={DetailOrderTeknisi}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Login"
          component={LoginPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Unverif"
          component={UnVerif}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Register"
          component={RegisterPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Verifikasi"
          component={VerifikasiPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Success"
          component={SuccessPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Home"
          component={HomePage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="FormOrder"
          component={FormOrderPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ListService"
          component={ListServicePage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DetailTeknisi"
          component={DetailTeknisiPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SuccessOrder"
          component={SuccessOrderPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DetailOrder"
          component={DetailOrder}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="EditProfileUser"
          component={EditProfileUserPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfilePage}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Maps"
          component={MapsPage}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Image"
          component={ImagePage}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="WebView"
          component={WebView}
          options={{headerShown: true, title: 'Video Kerusakan'}}
        />

        <Stack.Screen
          name="AdminHome"
          component={AdminHome}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AdminDetail"
          component={AdminDetail}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
