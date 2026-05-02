import {Routes, Route} from "react-router-dom"
import Register from "./pages/Register"
import Profile from "./pages/Profile.jsx"
import Login from "./pages/Login"
import Layout from "./components/Layout/default"
import {PrivateRouteAuth, PrivateRouteTeacher} from "./config/PrivateRoute.jsx";
import AuthProvider from "./context/AuthContext.jsx";
import CreateTest from "./pages/admin/CreateTest.jsx";
import NotFound from "./pages/NotFound.jsx";

function App() {
	return (
		<AuthProvider>
			<Routes>
				<Route path={'/register'} element={<Register/>}/>как
				<Route path={'/login'} element={<Login/>}/>
				<Route element={<PrivateRouteAuth/>}>
					<Route element={<Layout/>}>
						<Route path="/profile" element={<Profile/>}/>
					</Route>
					<Route element={<PrivateRouteTeacher/>}>
						<Route element={<Layout/>}>
							<Route path={"/create/test"} element={<CreateTest/>}></Route>
							<Route path={"/create/test/:id"} element={<CreateTest/>}></Route>
						</Route>
					</Route>
				</Route>
				<Route path="*" element={<NotFound />}></Route>
			</Routes>
		</AuthProvider>

	)
}

export default App
