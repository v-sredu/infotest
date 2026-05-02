import axios from "axios";

const APP_URL = import.meta.env["VITE_API_URL"];
export const getGroups = () => axios.get(APP_URL + '/groups');

// export const postLogOut = (role, token) => axios.post(APP_URL + '/' + role + '/logOut', {},{
// 	headers: {
// 		Authorization: `Bearer ${token}`
// 	}
// });
