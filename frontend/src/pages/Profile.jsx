import {useEffect, useState} from "react";
import {postProfileUpdate} from "../services/authServices.jsx";
import {useAuth} from "../context/AuthContext.jsx";
import {useGroups} from "../hooks/useGroups.jsx";
import ErrorAlert from "../components/ErrorAlert.jsx";
import SuccessAlert from "../components/SuccessAlert.jsx";

export default function Profile() {
	const {user, auth} = useAuth();
	const {groups} = useGroups();
	const [input, setInput] = useState({
		name: '',
		surname: '',
		email: '',
		password: '',
		confirm_password: '',
		group_id: ''
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [errors, setErrors] = useState([]);
	const [successMessage, setSuccessMessage] = useState("");

	useEffect(() => {
		if (user) {
			setInput((prev) => ({
				...prev,
				name: user.name || '',
				surname: user.surname || '',
				email: user.email || '',
				group_id: user.group_id || '',
			}));
		}
	}, [user]);
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
		setErrors([]);
		setSuccessMessage("");

		postProfileUpdate(input, user.role, user.token
		).then(res => {
			const data = res.data;
			auth(data.user);
			setInput((prev) => {
				return {
					...prev,
					password: '',
					confirm_password: ''
				};
			});
			setSuccessMessage("Данные успешно обновлены!");
		}).catch((error) => {
			if (error.response) {
				const status = error.response.status;
				const data = error.response.data;
				if (status >= 400 && status < 500) {
					setErrors(data.errors || ["Произошла ошибка при входе"]);
				} else {
					console.error("Ошибка сервера (5xx) или иная:", status);
				}
			} else {
				console.error("Ошибка сети или запроса:", error.message);
			}
		});
	}

	return (
		<>
			<div className="pattern h-30 relative">
				<div className="text-blue-900 flex absolute -bottom-5 left-5 gap-5">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
						className="h-20 w-20 bg-white rounded-full outline-4 outline-white"
						viewBox="0 0 16 16">
						<path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
						<path
							d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
					</svg>
					<div className="mt-4 font-bold text-2xl">
						{`${user.name} ${user.surname}`}
					</div>
				</div>
			</div>

			{/*form*/}
			<form className="py-6 mt-2" onSubmit={submit}>
				<div className="max-w-4xl mx-auto mt-3">
					<ErrorAlert errors={errors}/>
					<SuccessAlert message={successMessage}/>
					<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
						<div className="col-span-full rounded-lg" role="alert">
							<p>Вы вошли как {user.role === 'student' ? 'ученик' : 'учитель'}</p>
						</div>
						<div className="relative">
							<label htmlFor="name"
								className="absolute -top-2 left-4 bg-white dark:bg-neutral-900 px-1.5 text-xs font-medium text-slate-900 dark:text-slate-50">
								Имя
							</label>
							<input type="text" id="name" name="name" value={input.name}
								onChange={handleInput}
								className="block w-full px-4 py-3 text-sm text-slate-900 dark:text-slate-50 bg-transparent rounded-md outline-1 -outline-offset-1 outline-slate-300 dark:outline-neutral-700 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"/>
						</div>

						<div className="relative">
							<label htmlFor="surname"
								className="absolute -top-2 left-4 bg-white dark:bg-neutral-900 px-1.5 text-xs font-medium text-slate-900 dark:text-slate-50">
								Фамилия
							</label>
							<input type="text" id="surname" name="surname" value={input.surname}
								onChange={handleInput}
								className="block w-full px-4 py-3 text-sm text-slate-900 dark:text-slate-50 bg-transparent rounded-md outline-1 -outline-offset-1 outline-slate-300 dark:outline-neutral-700 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"/>
						</div>

						<div className="relative col-span-full">
							<label htmlFor="email"
								className="absolute -top-2 left-4 bg-white dark:bg-neutral-900 px-1.5 text-xs font-medium text-slate-900 dark:text-slate-50">
								Почта
							</label>
							<input type="email" id="email" name="email" value={input.email}
								onChange={handleInput}
								className="block w-full px-4 py-3 text-sm text-slate-900 dark:text-slate-50 bg-transparent rounded-md outline-1 -outline-offset-1 outline-slate-300 dark:outline-neutral-700 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"/>
						</div>

						<div className="relative">
							<label htmlFor="password"
								className="absolute -top-2 left-4 bg-white dark:bg-neutral-900 px-1.5 text-xs font-medium text-slate-900 dark:text-slate-50">
								Пароль
							</label>
							<input
								id="password"
								name="password"
								value={input.password}
								type={showPassword ? "text" : "password"}
								onChange={handleInput}
								className="block w-full px-4 py-3 text-sm text-slate-900 dark:text-slate-50 bg-transparent rounded-md outline-1 -outline-offset-1 outline-slate-300 dark:outline-neutral-700 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"/>
							<svg
								onClick={() => setShowPassword(!showPassword)}
								xmlns="http://www.w3.org/2000/svg"
								fill="#bbb"
								stroke="#bbb"
								className="w-[18px] h-[18px] absolute right-4 top-3 cursor-pointer"
								viewBox="0 0 128 128"
							>
								<path
									d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
								/>
							</svg>
						</div>

						<div className="relative">
							<label htmlFor="confirm_password"
								className="absolute -top-2 left-4 bg-white dark:bg-neutral-900 px-1.5 text-xs font-medium text-slate-900 dark:text-slate-50">
								Повторите пароль
							</label>
							<input
								id="confirm_password"
								name="confirm_password"
								value={input.confirm_password}
								type={showConfirmPassword ? "text" : "password"}
								onChange={handleInput}
								className="block w-full px-4 py-3 text-sm text-slate-900 dark:text-slate-50 bg-transparent rounded-md outline-1 -outline-offset-1 outline-slate-300 dark:outline-neutral-700 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"/>
							<svg
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								xmlns="http://www.w3.org/2000/svg"
								fill="#bbb"
								stroke="#bbb"
								className="w-[18px] h-[18px] absolute right-4 top-3 cursor-pointer"
								viewBox="0 0 128 128"
							>
								<path
									d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
								/>
							</svg>
						</div>

						{user.role === 'student' && (

							<div className="relative col-span-full">
								<label htmlFor="group"
									className="z-2 absolute -top-2 left-4 bg-white dark:bg-neutral-900 px-1.5 text-xs font-medium text-slate-900 dark:text-slate-50">
									Группа
								</label>
								<div className="relative flex items-center">
									<select
										id="group"
										name="group"
										value={input.group_id}
										onChange={handleInput}
										className="w-full text-sm text-slate-900 border border-slate-300 px-4 py-3 rounded-md outline-blue-600 appearance-none cursor-pointer"
									>
										<option value="">Выберите группу</option>
										{groups.map((group) => (
											<option key={group.id} value={group.id}>{group.name}</option>
										))}
									</select>
									<svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb"
										className="w-[18px] h-[18px] absolute right-4 pointer-events-none"
										viewBox="0 0 24 24">
										<path d="M7 10l5 5 5-5z"/>
									</svg>
								</div>
							</div>
						)}
					</div>

					<button type="submit"
						className="mt-8 py-2 px-3.5 text-sm rounded-md font-semibold cursor-pointer tracking-wide text-white bg-blue-900">
						Изменить данные
					</button>
				</div>
			</form>
		</>
	)
}
