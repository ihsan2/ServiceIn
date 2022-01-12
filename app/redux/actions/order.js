import {getData, getDatabyUID} from '../../config';

export const updateStatus = ({
  data = null,
  stts = '',
  reason = '',
  start = '',
  end = '',
} = {}) => {
  return (dispatch, getState) => {
    let {order} = getState().orderState;

    let index = order.findIndex(i => i.id == data.id);

    let arr = [...order];
    arr[index].status = stts;

    if (stts === 'cancel') {
      arr[index].reason = reason;
    } else if (stts === 'process') {
      arr[index].start = start;
      arr[index].end = end;
    }

    dispatch({
      type: 'UPDATE_ORDER',
      data: arr,
    });
  };
};

export const getOrders = uid => {
  return async dispatch => {
    let data = await getDatabyUID('orders', 'id_user', uid);

    dispatch({
      type: 'GET_ORDERS',
      data,
    });
  };
};

export const getOrderTeknisi = uid => {
  return async dispatch => {
    let data = await getDatabyUID('orders', 'id_teknisi', uid);

    dispatch({
      type: 'GET_ORDER_TEKNISI',
      data,
    });
  };
};

export const doLogout = () => {
  return dispatch => {
    dispatch({
      type: 'DO_LOGOUT',
    });
  };
};
