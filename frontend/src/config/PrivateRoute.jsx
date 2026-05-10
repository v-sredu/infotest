import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import {useAuth} from "../context/AuthContext.jsx";
import {PATHS} from "./path.js";

export const PrivateRouteAuth = () => {
	const {isAuthenticated} = useAuth();
	const {user} = useAuth();
	console.log(user);
	console.log(isAuthenticated);
	if (!isAuthenticated) return <Navigate to={PATHS.LOGIN} />;
	return <Outlet />;
};

export const PrivateRouteTeacher = () => {
	const {user} = useAuth();
	if (user.role !== 'teacher') return <Navigate to={PATHS.STUDENT.PROFILE} />;
	return <Outlet />;
};

export const PrivateRouteStudent = () => {
	const {user} = useAuth();
	if (user.role !== 'student') return <Navigate to={PATHS.TEACHER.PROFILE} />;
	return <Outlet />;
};
