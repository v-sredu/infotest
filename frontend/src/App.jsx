import {Routes, Route} from "react-router-dom"
import Register from "./pages/Register"
import Profile from "./pages/Profile.jsx"
import Login from "./pages/Login"
import Layout from "./components/Layout/default"
import {PrivateRouteAuth, PrivateRouteStudent, PrivateRouteTeacher} from "./config/PrivateRoute.jsx";
import AuthProvider from "./context/AuthContext.jsx";
import CreateTest from "./pages/teacher/CreateTest.jsx";
import NotFound from "./pages/NotFound.jsx";
import {Tests as AllTestTeacher} from "./pages/teacher/Tests.jsx";
import AvailableTests from "./pages/student/AvailableTests.jsx";
import Test from "./pages/student/Test.jsx";
import {PATHS} from "./config/path.js";
import PassedTests from "./pages/student/PassedTests.jsx";
import StatisticsTest from "./pages/teacher/StatisticsTest.jsx";

function App() {
	return (
		<AuthProvider>
			<Routes>
				<Route path={PATHS.REGISTER} element={<Register/>}/>как
				<Route path={PATHS.LOGIN} element={<Login/>}/>
				<Route element={<PrivateRouteAuth/>}>
					<Route element={<PrivateRouteTeacher/>}>
						<Route element={<Layout/>}>
							<Route path={PATHS.TEACHER.PROFILE} element={<Profile/>}/>
							<Route path={PATHS.TEACHER.CREATE_TEST} element={<CreateTest/>}/>
							<Route path={PATHS.TEACHER.TEST} element={<CreateTest/>}/>
							<Route path={PATHS.TEACHER.TESTS} element={<AllTestTeacher/>}/>
							<Route path={PATHS.TEACHER.STATISTICS_TEST} element={<StatisticsTest />}/>
						</Route>
					</Route>
					<Route element={<PrivateRouteStudent/>}>
						<Route element={<Layout/>}>
							<Route path={PATHS.STUDENT.PROFILE} element={<Profile/>}/>
							<Route path={PATHS.STUDENT.AVAILABLE_TESTS} element={<AvailableTests/>}/>
							<Route path={PATHS.STUDENT.PASSED_TESTS} element={<PassedTests />}/>
							<Route path={PATHS.STUDENT.TEST} element={<Test/>}/>
						</Route>
					</Route>
				</Route>
			<Route path={PATHS.ALL} element={<NotFound/>}/>
			</Routes>
		</AuthProvider>

	)
}

export default App
