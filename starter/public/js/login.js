/* eslint-disable */
// import '@babel/polyfill';
import axios from 'axios';
import { showAlert } from './alert';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      // mode: 'same-origin',
      // redirect: 'follow',
      // withCredentials: true, // Don't forget to specify this if you need cookies
      // headers: headers,
      // credentials: 'include',
      // url: 'http://127.0.0.1:3000/api/v1/users/login',
      url: '/api/v1/users/login',
      // we should use localhost to prevent browser from not setting cookie
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });
    if (res.data.status === 'success') location.reload(true); // this set to true will ensure that we get a fresh page from server and donot reload from cache
  } catch (err) {
    console.log(err);
    showAlert('error', 'error logging out! Try again ');
  }
};
