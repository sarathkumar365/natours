/* eslint-disable */

import axios from 'axios';

import { showAlert } from './alert';

// type is either data or password
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://localhost:3000/api/v1/users/updateMyPassword'
        : 'http://localhost:3000/api/v1/users/updateMe';

    console.log(url);
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully `);
    }
  } catch (err) {
    console.log(err);
    showAlert('error', error.response.data.message);
  }
};
