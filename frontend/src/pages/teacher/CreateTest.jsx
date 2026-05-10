import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { nanoid } from 'nanoid';

import { useGroups } from "../../hooks/useGroups.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
// Добавлен импорт deleteTest
import {createTest, updateTest, deleteTest, getTeacherTest} from "../../services/testServices.jsx";

import ErrorAlert from "../../components/ErrorAlert.jsx";
import SuccessAlert from "../../components/SuccessAlert.jsx";
import {PATHS} from "../../config/path.js";

export default function CreateTest() {
	// --- 1. Константы и инициализация ---
	const getEmptyTask = () => ({
		id: nanoid(),
		question_title: '',
		option_a: '',
		option_b: '',
		option_c: '',
		option_d: '',
		correct_option: 'A'
	});

	const INITIAL_TEST_DATA = { id: '', name: '', description: '', selected_groups: [] };

	// --- 2. Хуки и стейт ---
	const navigate = useNavigate();
	const { user } = useAuth();
	const { groups } = useGroups();
	const { id } = useParams();

	const isEditMode = Boolean(id);

	const [errors, setErrors] = useState([]);
	const [successMessage, setSuccessMessage] = useState("");
	const [testData, setTestData] = useState(INITIAL_TEST_DATA);
	const [tasks, setTasks] = useState([getEmptyTask()]);

	// --- 3. Эффекты (Загрузка данных) ---
	useEffect(() => {
		if (isEditMode) {
			getTeacherTest(user.token, id)
				.then((res) => {
					const data = res.data;
					setTasks(data.tasks);
					setTestData({
						id: data.id,
						name: data.name,
						description: data.description,
						selected_groups: data.selected_groups
					});
				})
				.catch(() => setErrors(['Ошибка получения данных теста']));
		} else {
			setTestData(INITIAL_TEST_DATA);
			setTasks([getEmptyTask()]);
			setErrors([]);
			setSuccessMessage("");
		}
	}, [id, isEditMode, user.token]);

	// --- 4. Обработчики событий (Handlers) ---
	const handleAddTask = () => setTasks(prev => [...prev, getEmptyTask()]);

	const handleRemoveTask = (taskId) => setTasks(prev => prev.filter(t => t.id !== taskId));

	const handleTaskChange = (taskId, field, value) => {
		setTasks(prev => prev.map(t => t.id === taskId ? { ...t, [field]: value } : t));
	};

	// НОВЫЙ: Обработчик удаления теста
	const handleDelete = () => {
		if (window.confirm("Вы уверены, что хотите полностью удалить этот тест? Это действие необратимо.")) {
			deleteTest(user.token, id)
				.then(() => {
					navigate(PATHS.TEACHER.TESTS); // Перенаправляем на список всех тестов
				})
				.catch((err) => {
					setErrors(["Не удалось удалить тест. Возможно, он уже удален или у вас недостаточно прав."]);
				});
		}
	};

	const submit = () => {
		setErrors([]);
		const input = { ...testData, tasks };
		const apiCall = isEditMode ? updateTest(user.token, id, input) : createTest(user.token, input);

		apiCall.then((res) => {
            console.log(12345);
			const data = res.data;
			setTasks(data.tasks);
			setTestData(data);
			setSuccessMessage(isEditMode ? "Изменения сохранены" : "Тест успешно создан");
			if (!isEditMode) navigate(PATHS.TEACHER.toTest(data.id), { replace: true });
		}).catch((err) => {
			const serverErrors = err.response?.data?.errors;
			setErrors(serverErrors || ["Произошла ошибка при сохранении"]);
		});
	};

	// --- 5. Вспомогательные части интерфейса ---
	const renderTable = (
		<div className="border border-zinc-300 rounded overflow-hidden shadow-sm mb-6 bg-white">
			<div className="overflow-x-auto">
				<table className="w-full text-sm text-left border-collapse">
					<thead className="bg-zinc-50 border-b border-zinc-300 text-gray-600">
					<tr>
						<th className="px-4 py-3 font-bold uppercase text-[10px]">Вопрос</th>
						{['A', 'B', 'C', 'D'].map(label => (
							<th key={label} className="px-4 py-3 font-bold uppercase text-[10px] w-32 border-l border-zinc-200">{label}</th>
						))}
						<th className="px-4 py-3 font-bold uppercase text-[10px] w-24 text-center border-l border-zinc-200">Верный</th>
						<th className="px-4 py-3 w-12 border-l border-zinc-200"></th>
					</tr>
					</thead>
					<tbody className="divide-y divide-zinc-200">
					{tasks.map((task) => (
						<tr key={task.id} className="hover:bg-zinc-50 transition-colors">
							<td className="p-2">
								<input className="w-full p-2 border border-zinc-200 rounded focus:border-blue-900 outline-none"
									value={task.question_title} onChange={(e) => handleTaskChange(task.id, 'question_title', e.target.value)} />
							</td>
							{['a', 'b', 'c', 'd'].map(opt => (
								<td key={opt} className="p-2 border-l border-zinc-100">
									<input className="w-full p-2 border border-zinc-200 rounded focus:border-blue-900 outline-none"
										value={task[`option_${opt}`] || ''} onChange={(e) => handleTaskChange(task.id, `option_${opt}`, e.target.value)} />
								</td>
							))}
							<td className="p-2 text-center border-l border-zinc-100">
								<select className="p-1.5 border border-zinc-300 rounded bg-white font-bold"
									value={task.correct_option} onChange={(e) => handleTaskChange(task.id, 'correct_option', e.target.value)}>
									{['A', 'B', 'C', 'D'].map(v => <option key={v} value={v}>{v}</option>)}
								</select>
							</td>
							<td className="p-2 text-center border-l border-zinc-100">
								<button onClick={() => handleRemoveTask(task.id)} className="p-1 text-zinc-400 hover:text-red-600 transition-colors">
									<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
								</button>
							</td>
						</tr>
					))}
					</tbody>
				</table>
			</div>
		</div>
	);

	// --- 6. Основной рендер ---
	return (
		<div className="w-full">
			<div className="mb-6 flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-200 pb-4">
				<div>
					<h1 className="text-2xl font-bold text-gray-800">{isEditMode ? "Редактирование теста" : "Создание нового теста"}</h1>
					<p className="text-sm text-gray-500 mt-1 font-medium">Заполните информацию и добавьте вопросы</p>
				</div>

				{/* Секция кнопок управления */}
				<div className="mt-3 md:m-0 flex items-center gap-2">
					{isEditMode && (
						<button
							onClick={handleDelete}
							className="flex items-center gap-2 px-4 py-2 text-red-300 font-medium rounded border border-red-200 hover:bg-red-800 hover:text-white active:scale-95 transition-all shadow-sm"
						>
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"/></svg>
							Удалить
						</button>
					)}

					<button onClick={submit} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-bl from-blue-700 to-blue-900 text-white font-medium rounded active:scale-95 transition-all shadow-sm cursor-pointer">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg>
						{isEditMode ? 'Обновить тест' : 'Создать тест'}
					</button>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				<div className="md:col-span-2 space-y-4">
					<ErrorAlert errors={errors} />
					<SuccessAlert message={successMessage} />
					<div>
						<label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">Название теста</label>
						<input type="text" className="w-full px-3 py-2 border border-zinc-300 rounded focus:border-blue-900 outline-none shadow-sm text-sm"
							value={testData.name} onChange={(e) => setTestData(prev => ({ ...prev, name: e.target.value }))} />
					</div>
					<div>
						<label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">Описание</label>
						<textarea className="w-full px-3 py-2 border border-zinc-300 rounded focus:border-blue-900 outline-none shadow-sm text-sm h-24 resize-none"
							value={testData.description} onChange={(e) => setTestData(prev => ({ ...prev, description: e.target.value }))} />
					</div>
				</div>

				<div>
					<label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">Группы доступа</label>
					<select multiple className="w-full px-2 py-1 border border-zinc-300 rounded focus:border-blue-900 outline-none h-[155px] text-sm shadow-sm"
						value={testData.selected_groups} onChange={(e) => setTestData(prev => ({ ...prev, selected_groups: Array.from(e.target.selectedOptions, o => o.value) }))}>
						{groups.map(g => <option key={g.id} value={g.id} className="p-1.5 border-b border-zinc-100 last:border-0">{g.name}</option>)}
					</select>
				</div>
			</div>

			{renderTable}

			<button onClick={handleAddTask} className="flex items-center gap-2 px-2 py-3 border-2 border-dashed border-zinc-200 text-zinc-400 rounded-lg hover:border-blue-900 hover:text-blue-900 transition-all w-full justify-center font-bold">
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
				Добавить новое задание
			</button>
		</div>
	);
}
