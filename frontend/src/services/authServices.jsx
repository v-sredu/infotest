import axios from "axios";

const APP_URL = import.meta.env["VITE_API_URL"];

export const postRegister = (data, role) => axios.post(APP_URL + '/' + role + '/register', data);
export const postLogin = (data, role) => axios.post(APP_URL + '/' + role + '/login', data);
export const postLogOut = (role, token) => axios.post(APP_URL + '/' + role + '/logOut', {},{
	headers: {
		Authorization: `Bearer ${token}`
	}
});

export const postProfileUpdate = (data, role, token) => axios.post(APP_URL + '/' + role + '/profile', data, {
	headers: {
		Authorization: `Bearer ${token}`
	}
});
