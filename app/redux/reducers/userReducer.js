const initialState = {
  role: '',
  users: [],
  user: null,
  listUser: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_ROLE':
      return {...state, role: action.data};

    case 'SET_USER':
      return {...state, user: action.data};

    case 'GET_USERS':
      return {...state, users: action.data};

    case 'GET_LIST_USER':
      return {...state, listUser: action.data};

    case 'DO_LOGOUT':
      return initialState;
  }

  return state;
}
