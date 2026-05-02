import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import {useAuth} from "../context/AuthContext.jsx";

export const PrivateRouteAuth = () => {
	const {isAuthenticated} = useAuth();
	if (!isAuthenticated) return <Navigate to={'/login'} />;
	return <Outlet />;
};

export const PrivateRouteTeacher = () => {
	const {user} = useAuth();
	console.log(user);
	if (user.role !== 'teacher') return <Navigate to={'/login'} />;
	return <Outlet />;
};
