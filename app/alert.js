import Toast from 'react-native-toast-message';

export const showAlert = ({type = 'success', text = ''} = {}) => {
  Toast.show({
    type: type,
    text1: text,
    topOffset: 0,
    visibilityTime: 2400,
  });
};
