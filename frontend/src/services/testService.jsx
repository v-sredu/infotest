import axios from "axios";

const APP_URL = import.meta.env["VITE_API_URL"];

export const getTest = (token, id) => axios.get(APP_URL + '/test/' + id, {
	headers: {
		Authorization: `Bearer ${token}`
	}
});

export const postTest = (token, data) => axios.post(APP_URL + '/test', data, {
	headers: {
		Authorization: `Bearer ${token}`
	}
});
