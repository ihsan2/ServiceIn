const initialState = {
  order: [
    {
      id: 1,
      name: 'Taufik Hidayat',
      address:
        'Jalan Tun Abdul Razak, Romangpolong, Somba Opu, Romangpolong, Kec. Somba Opu, Kabupaten Gowa, Sulawesi Selatan 90235',
      status: 'waiting',
      jenis: 'AC',
      merk: 'Sharp',
      type: 'Tidak dingin',
    },
    {
      id: 2,
      name: 'Budi',
      address:
        'Jalan Tun Abdul Razak, Romangpolong, Somba Opu, Romangpolong, Kec. Somba Opu, Kabupaten Gowa, Sulawesi Selatan 90235',
      status: 'waiting',
      jenis: 'Laptop',
      merk: 'ASUS',
      type: 'Layar retak',
    },
  ],
  orders: [],
  orders_tek: [],
  isEdit: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_ORDER':
      return {...state, order: action.data};

    case 'GET_ORDERS':
      return {...state, orders: action.data};

    case 'GET_ORDER_TEKNISI':
      return {...state, orders_tek: action.data};

    case 'DO_LOGOUT':
      return initialState;
  }

  return state;
}
