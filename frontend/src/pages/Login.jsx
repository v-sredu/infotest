import {useState} from 'react';
import {postLogin} from "../services/authServices.jsx";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext.jsx";
import ErrorAlert from "../components/ErrorAlert.jsx";
import {PATHS} from "../config/path.js";

export default function Login() {
	const navigate = useNavigate();
	const {auth} = useAuth();

	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState([]);
	const [role, setRole] = useState('student');
	const [input, setInput] = useState({
		email: '',
		password: '',
	});
	const handleInput = (e) => {
		const {name, value} = e.target;
		setInput((prev) => ({
			...prev,
			[name]: value,
		}));
	};
	// отправка формы
	const submit = (e) => {
		e.preventDefault();
		setErrors([]); // Сбрасываем старые ошибки

		postLogin(input, role)
			.then((res) => {
				const data = res.data;
				const role = data.user.role.toUpperCase();
				auth(data.user);
				navigate(PATHS[role].PROFILE);
			})
			.catch((error) => {
				if (error.response) {
					const status = error.response.status;
					const data = error.response.data;
					if (status >= 400 && status < 500) {
						setErrors(data.errors || ["Произошла ошибка при входе"]);
					} else {
						setErrors(['Ошибка на сервере']);
						console.error("Ошибка сервера (5xx) или иная:", status);
					}
				} else {
					setErrors(['Ошибка сети']);
					console.error("Ошибка сети или запроса:", error.message);
				}
			});
	};

	return (
		<>
			<div>
				<div
					className="grid lg:grid-cols-2 gap-4 max-lg:gap-12 bg-gradient-to-r from-blue-500 to-blue-900 sm:px-8 px-4 py-12 h-[320px]">
					<div>
						<div className="max-w-lg mt-16 max-lg:hidden">
							<h1 className="text-4xl font-semibold text-white">Вход в аккаунт</h1>
							<p className="text-[15px] mt-4 text-slate-100 leading-relaxed">Войдите в сервис
								чтобы использовать все его возможности</p>
						</div>
					</div>

					<div className="pb-4">
						<div
							className="bg-white rounded-xl sm:px-6 px-4 py-8 max-w-md w-full h-max [box-shadow:0_2px_10px_-3px_rgba(6,81,237,0.3)] max-lg:mx-auto">
							<form onSubmit={submit}>
								<div className="mb-8">
									<h2 className="text-3xl text-center font-semibold text-slate-900">Вход</h2>
								</div>

								<div className="space-y-6">
									<ErrorAlert errors={errors} />
									{/* Выпадающий список "Роль" */}
									<div>
										<label className="text-slate-900 text-sm font-medium mb-2 block">Роль</label>
										<div className="relative flex items-center">
											<select
												name="role"
												value={role}
												onChange={(e) => setRole(e.target.value)}
												required
												className="w-full text-sm text-slate-900 border border-slate-300 px-4 py-3 rounded-md outline-blue-600 appearance-none cursor-pointer"
											>
												<option value="">Выберите роль</option>
												<option value="student">Ученик</option>
												<option value="teacher">Учитель</option>
											</select>
											<svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb"
												className="w-[18px] h-[18px] absolute right-4 pointer-events-none"
												viewBox="0 0 24 24">
												<path d="M7 10l5 5 5-5z"/>
											</svg>
										</div>
									</div>

									{/* Поле "Email" */}
									<div>
										<label className="text-slate-900 text-sm font-medium mb-2 block">Email</label>
										<div className="relative flex items-center">
											<input
												name="email"
												type="email"
												value={input.email}
												onChange={handleInput}
												required
												className="w-full text-sm text-slate-900 border border-slate-300 pr-8 px-4 py-3 rounded-md outline-blue-600"
												placeholder="example@mail.com"
											/>
											<svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb"
												className="w-[18px] h-[18px] absolute right-4" viewBox="0 0 24 24">
												<path
													d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
											</svg>
										</div>
									</div>

									{/* Поле "Пароль" */}
									<div>
										<label className="text-slate-900 text-sm font-medium mb-2 block">Пароль</label>
										<div className="relative flex items-center">
											<input
												name="password"
												type={showPassword ? "text" : "password"}
												value={input.password}
												onChange={handleInput}
												required
												className="w-full text-sm text-slate-900 border border-slate-300 pr-8 px-4 py-3 rounded-md outline-blue-600"
												placeholder="**************"
											/>
											<svg
												onClick={() => setShowPassword(!showPassword)}
												xmlns="http://www.w3.org/2000/svg"
												fill="#bbb"
												stroke="#bbb"
												className="w-[18px] h-[18px] absolute right-4 cursor-pointer"
												viewBox="0 0 128 128"
											>
												<path
													d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
												/>
											</svg>
										</div>
									</div>
								</div>

								<div className="mt-8">
									<button type="submit"
										className="w-full shadow-xl py-2 px-4 text-[15px] font-medium rounded-md text-white bg-blue-900 hover:bg-blue-700 focus:outline-none cursor-pointer"
									>
										Войти
									</button>
								</div>
								<p className="text-sm mt-6 text-center text-slate-600">Нет аккаунта?
									<Link
										to={PATHS.REGISTER}
										className="text-blue-600 font-medium hover:underline ml-1 whitespace-nowrap"
									>
										Зарегистрироваться
									</Link>
								</p>
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
