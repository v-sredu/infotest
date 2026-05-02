import React, {useEffect, useState} from 'react';
import {useGroups} from "../../hooks/useGroups.jsx";
import {useParams} from "react-router-dom";
import {getTest, postTest} from "../../services/testService.jsx";
import {useAuth} from "../../context/AuthContext.jsx";
import { nanoid } from 'nanoid';

export default function CreateTest() {
	const {user} = useAuth();
	const [errors, setErrors] = useState([]);
	const {id} = useParams();
	const isEditMode = Boolean(id);
	const [testData, setTestData] = useState({
		name: '',
		description: '',
		selectedGroups: []
	});

	const [tasks, setTasks] = useState([
		{
			id: nanoid(),
			task_title: '',
			option_a: '',
			option_b: '',
			option_c: '',
			option_d: '',
			correct_option: 'a'
		}
	]);

	const {groups} = useGroups();

	const handleAddTask = () => {
		setTasks([...tasks, {
			id: nanoid(),
			task_title: '',
			option_a: '',
			option_b: '',
			option_c: '',
			option_d: '',
			correct_option: 'a'
		}]);
	};

	const handleRemoveTask = (id) => {
		setTasks(tasks.filter(task => task.id !== id));
	};

	const handleTaskChange = (id, field, value) => {
		setTasks(tasks.map(task => task.id === id ? {...task, [field]: value} : task));
	};

	useEffect(() => {
		if (isEditMode) {
			getTest(user.token, id).then((res) => {
				const data = res.data;
				setTasks(data.tasks);
				setTestData({
					name: data.name,
					description: data.description,
					selectedGroups: data.selectedGroups
				})
			}).catch((error) => {
				if (error.response) {
					const status = error.response.status;
					const data = error.response.data;
					if (status >= 400 && status < 500) {
						setErrors(data.errors || ["Произошла ошибка при отправке данных"]);
					} else {
						console.error("Ошибка сервера (5xx) или иная:", status);
					}
				} else {
					console.error("Ошибка сети или запроса:", error.message);
				}
			})
		}
	}, [id, isEditMode]);
	const submit = () => {
		setErrors([]);
		const input = {...testData, tasks: tasks};
		postTest(user.token, input).then((res) => {
			const data = res.data;
			setTasks(data.tasks);
			setTestData({
				name: data.name,
				description: data.description,
				selectedGroups: data.selectedGroups
			})
		}).catch((error) => {
			if (error.response) {
				const status = error.response.status;
				const data = error.response.data;
				if (status >= 400 && status < 500) {
					setErrors(data.errors || ["Произошла ошибка при отправке данных"]);
				} else {
					console.error("Ошибка сервера (5xx) или иная:", status);
				}
			} else {
				console.error("Ошибка сети или запроса:", error.message);
			}
		})
	};

	return (
		<div className="w-full">
			{/* Заголовок страницы */}
			<div
				className="mb-6 flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-200 pb-4">
				<div>
					<h1 className="text-2xl font-bold text-gray-800">Создание нового теста</h1>
					<p className="text-sm text-gray-500 mt-1">Заполните информацию и добавьте вопросы в таблицу ниже</p>
				</div>
				<button
					onClick={submit}
					className="mt-3 md:m-0 flex items-center gap-2 px-2 py-1 bg-gradient-to-bl from-blue-700 to-blue-900 text-white font-medium rounded hover:cursor-pointer active:shadow-lg active:scale-99 shadow-sm"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
						stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
						<polyline points="17 21 17 13 7 13 7 21"/>
						<polyline points="7 3 7 8 15 8"/>
					</svg>
					Сохранить тест
				</button>
			</div>

			{/* Контейнер полей ввода */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				<div className="md:col-span-2 space-y-4">
					<div>
						<label className="block text-xs font-bold uppercase text-gray-500 mb-1">Название теста</label>
						<input
							type="text"
							className="w-full px-3 py-2 border border-zinc-300 rounded focus:border-blue-900 outline-none transition-colors shadow-sm text-sm"
							placeholder="Введите название..."
							value={testData.name}
							onChange={(e) => setTestData({...testData, name: e.target.value})}
						/>
					</div>
					<div>
						<label className="block text-xs font-bold uppercase text-gray-500 mb-1">Описание</label>
						<textarea
							className="w-full px-3 py-2 border border-zinc-300 rounded focus:border-blue-900 outline-none transition-colors shadow-sm text-sm h-24 resize-none"
							placeholder="Краткое описание целей теста..."
							value={testData.description}
							onChange={(e) => setTestData({...testData, description: e.target.value})}
						/>
					</div>
				</div>

				<div>
					<label className="block text-xs font-bold uppercase text-gray-500 mb-1">Группы (Multiple)</label>
					<select
						multiple
						className="w-full px-2 py-1 border border-zinc-300 rounded focus:border-blue-900 outline-none h-[152px] text-sm shadow-sm"
						value={testData.selectedGroups}
						onChange={(e) => {
							const values = Array.from(e.target.selectedOptions, option => option.value);
							setTestData({...testData, selectedGroups: values});
						}}
					>
						{groups.map(group => (
							<option key={group.id} value={group.id}
								className="p-1.5 border-b border-zinc-100 last:border-0">{group.name}</option>
						))}
					</select>
				</div>
			</div>

			{/* Таблица заданий */}
			<div className="border border-zinc-300 rounded overflow-hidden shadow-sm mb-6">
				<div className="overflow-x-auto">
					<table className="w-full text-sm text-left border-collapse">
						<thead className="bg-zinc-50 border-b border-zinc-300 text-gray-600">
						<tr>
							<th className="px-4 py-3 font-bold uppercase text-[11px]">Вопрос (Название задания)</th>
							<th className="px-4 py-3 font-bold uppercase text-[11px] w-32 border-l border-zinc-200">A</th>
							<th className="px-4 py-3 font-bold uppercase text-[11px] w-32 border-l border-zinc-200">B</th>
							<th className="px-4 py-3 font-bold uppercase text-[11px] w-32 border-l border-zinc-200">C</th>
							<th className="px-4 py-3 font-bold uppercase text-[11px] w-32 border-l border-zinc-200">D</th>
							<th className="px-4 py-3 font-bold uppercase text-[11px] w-24 text-center border-l border-zinc-200">Верный</th>
							<th className="px-4 py-3 w-12 border-l border-zinc-200"></th>
						</tr>
						</thead>
						<tbody className="divide-y divide-zinc-200">
						{tasks.map((task) => (
							<tr key={task.id} datatype={task.id} className="hover:bg-zinc-50 transition-colors">
								<td className="p-2">
									<input
										className="w-full p-2 border border-zinc-200 rounded focus:border-blue-900 outline-none"
										value={task.task_title}
										onChange={(e) => handleTaskChange(task.id, 'task_title', e.target.value)}
									/>
								</td>
								{['a', 'b', 'c', 'd'].map(opt => (
									<td key={opt} className="p-2 border-l border-zinc-100">
										<input
											className="w-full p-2 border border-zinc-200 rounded focus:border-blue-900 outline-none"
											value={opt}
											onChange={(e) => handleTaskChange(task.id, {opt}, e.target.value)}
										/>
									</td>
								))}
								<td className="p-2 text-center border-l border-zinc-100">
									<select
										className="p-1.5 border border-zinc-300 rounded bg-white text-blue-900 font-bold outline-none"
										value={task.correct_option}
										onChange={(e) => handleTaskChange(task.id, 'correct_option', e.target.value)}
									>
										<option value="a">A</option>
										<option value="b">B</option>
										<option value="c">C</option>
										<option value="d">D</option>
									</select>
								</td>
								<td className="p-2 text-center border-l border-zinc-100">
									<button
										onClick={() => handleRemoveTask(task.id)}
										className="p-1 text-zinc-400 hover:text-red-600 transition-colors"
									>
										<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
											viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
											strokeLinecap="round" strokeLinejoin="round">
											<path
												d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m-6 9v4m4-4v4"/>
										</svg>
									</button>
								</td>
							</tr>
						))}
						</tbody>
					</table>
				</div>
			</div>

			{/*Кнопка добавления задания*/}
			<button
				onClick={handleAddTask}
				className="flex items-center gap-2 px-2 py-1 border-2 border-dashed border-zinc-200 text-zinc-400 rounded-lg hover:border-solid  hover:text-blue-900 transition-all w-full justify-center font-medium"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
					stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
					<path d="M12 5v14M5 12h14"/>
				</svg>
				Добавить новое задание
			</button>
		</div>
	);
};
