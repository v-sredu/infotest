import {createContext, useContext, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {postLogOut} from "../services/authServices.jsx";
import {PATHS} from "../config/path.js";

const AuthContext = createContext({});

const AuthProvider = ({children}) => {
	const navigate = useNavigate();
	const [isAuthenticated, setIsAuthenticated] = useState(() => {
		return localStorage.getItem("isAuthenticated") === "true";
	});
	const [user, setUser] = useState(() => {
		const userLocal = localStorage.getItem('user');
		return userLocal ? JSON.parse(userLocal) : {};
	});
	const auth = (userData) => {
		setUser((prevUser) => {
			return {
				...prevUser,
				...userData
			};
		});
		setIsAuthenticated(true);
		localStorage.setItem('isAuthenticated', 'true');
		localStorage.setItem('user', JSON.stringify(userData));
	};

	const logOut = () => {
		postLogOut(user.role, user.token).then(() => {
		}).catch((error) => {
			console.error("Ошибка на сервере")
		});
		setIsAuthenticated(false);
		setUser({});
		localStorage.clear();
		navigate(PATHS.LOGIN);
	}

	return (
		<AuthContext.Provider value={{user, isAuthenticated, logOut, auth}}>
			{children}
		</AuthContext.Provider>
	);
}

export default AuthProvider;

export function useAuth() {
	return useContext(AuthContext);
}
