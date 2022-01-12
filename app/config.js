import database from '@react-native-firebase/database';

export const getData = async tb => {
  const data = [];
  await database()
    .ref(tb)
    .once('value', snapshot => {
      snapshot.forEach(values => {
        data.push(values.val());
      });
    });
  return data;
};

export const getOneData = async tb => {
  let data = {};
  await database()
    .ref(tb)
    .once('value', snapshot => {
      data = snapshot.val();
    });
  return data;
};

export const getDatabyUID = async (tb, child, uid) => {
  const data = [];
  await database()
    .ref(tb)
    .orderByChild(child)
    .equalTo(`${uid}`)
    .once('value', snapshot => {
      snapshot.forEach(values => {
        data.push(values.val());
      });
    });

  return data;
};

export const getMenu = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let menu = [
        {
          id: 1,
          name: 'AC',
          select: false,
          icon: 'air-conditioner',
        },
        {
          id: 2,
          name: 'TV',
          select: false,
          icon: 'youtube-tv',
        },
        {
          id: 3,
          name: 'Handphone',
          select: false,
          icon: 'cellphone-android',
        },
        {
          id: 4,
          name: 'Laptop',
          select: false,
          icon: 'laptop',
        },
        {
          id: 5,
          name: 'Mesin Cuci',
          select: false,
          icon: 'washing-machine',
        },
        {
          id: 6,
          name: 'Kulkas',
          select: false,
          icon: 'fridge',
        },
        {
          id: 7,
          name: 'Kipas Angin',
          select: false,
          icon: 'fan',
        },
        {
          id: 8,
          name: 'CCTV',
          select: false,
          icon: 'cctv',
        },
        {
          id: 9,
          name: 'Komputer',
          select: false,
          icon: 'desktop-classic',
        },
        {
          id: 10,
          name: 'Printer',
          select: false,
          icon: 'printer',
        },
        {
          id: 11,
          name: 'LCD',
          select: false,
          icon: 'projector',
        },
      ];
      resolve(menu);
    }, 250);
  });
};
