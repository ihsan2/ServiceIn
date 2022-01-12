import axios from 'axios';

export const sendNotif = ({
  title = '',
  body = '',
  parent = '',
  link = '',
  device_id = '',
} = {}) => {
  let data = {
    to: device_id,
    notification: {
      title: title,
      body: body,
    },
    data: {
      title: title,
      body: body,
      parent: parent,
      link: link,
    },
    priority: 'high',
  };
  axios
    .post('https://fcm.googleapis.com/fcm/send', data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'key=AAAArBGh2mw:APA91bFWJprFZ-PomIj9COVgszDangWFLZKr6w2FhzUUdQwVV-Af-cD5m7HJky-KS1pwDwIQy9l5TWKeqrunWqoII0o2gaABrJ4uSSEp4wvieWZF-sYZTQbEmc6o0ni22XVQrKx5Hpk8',
      },
    })
    .then(() => {
      console.log('success send notif');
    })
    .catch(err => {
      console.log(err.response.data);
    });
};
