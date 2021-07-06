/* eslint-disable */

// type is either success or failure
export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el); //this will move one level up to the parent element and remove a child from there
};

export const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}<div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 5000);
};
