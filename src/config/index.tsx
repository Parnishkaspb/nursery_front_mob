const LOCALHOST = 'http://127.0.0.1:8000/';
const DOMAIN = '';

export const BASE_URL = LOCALHOST;


// export const GET_BANNERS = `${BASE_URL}api/banners`;
// export const GET_DOCTORS = `${BASE_URL}api/doctors`;
// export const GET_CATEGORIES = `${BASE_URL}api/categories`;
// export const GET_DIAGNOSTICS = `${BASE_URL}api/diagnostics`;
// export const GET_APPOINTMENTS = `${BASE_URL}api/appointments`;
// export const GET_NOTIFICATIONS = `${BASE_URL}api/notifications`;

export const LOGIN_USER = `${BASE_URL}api/user/login`;
export const CREATE_USER = `${BASE_URL}api/user/register`;
export const GET_USER = `${BASE_URL}api/user/update`;
export const UPDATE_PASSWORD_USER = `${BASE_URL}api/user/updatepassword`;
export const LOGOUT_USER = `${BASE_URL}api/user/logout`;

export const USER_INVESTITIONS = `${BASE_URL}api/user/investitions`;


// export const NEW_APPOINTMENT = `${BASE_URL}api/appointments/create`;

export const ENDPOINTS = {
  BASE_URL,
  GET_USER,
  LOGIN_USER,
  UPDATE_PASSWORD_USER,
  LOGOUT_USER,
  CREATE_USER,
  USER_INVESTITIONS,


  // GET_DOCTORS,
  // GET_BANNERS,

  // GET_CATEGORIES,
  // GET_DIAGNOSTICS,
  // GET_APPOINTMENTS,
  // GET_NOTIFICATIONS,
};


