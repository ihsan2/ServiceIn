import {getData, getOneData} from '../../config';
import database from '@react-native-firebase/database';

export const setRole = role => {
  return dispatch => {
    dispatch({
      type: 'SET_ROLE',
      data: role,
    });
  };
};

export const setUser = user => {
  return dispatch => {
    dispatch({
      type: 'SET_USER',
      data: user,
    });
  };
};

export const getUser = uid => {
  return async dispatch => {
    let user = await getOneData(`users/${uid}`);

    dispatch({
      type: 'SET_USER',
      data: user,
    });
  };
};

export const getUsers = () => {
  return async dispatch => {
    let arr = await getData('users');

    dispatch({
      type: 'GET_USERS',
      data: arr,
    });
  };
};

export const getListUser = () => {
  return async dispatch => {
    let arr = await getData('users');
    let newD = arr.filter(k => k.role === 'teknisi' && k.isUpload === true);

    dispatch({
      type: 'GET_LIST_USER',
      data: newD,
    });

    return newD;
  };
};

export const doLogout = () => {
  return dispatch => {
    dispatch({
      type: 'DO_LOGOUT',
    });
  };
};
