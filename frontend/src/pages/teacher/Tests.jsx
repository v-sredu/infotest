import { getTeacherTests } from "../../services/testServices.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ErrorAlert from "../../components/ErrorAlert.jsx";
import { PATHS } from "../../config/path.js";

export function Tests() {
    const { user } = useAuth();
    const [errors, setErrors] = useState([]);
    const [testsData, setTestsData] = useState([]);

    useEffect(() => {
        getTeacherTests(user.token)
            .then((res) => {
                setTestsData(res.data);
            }).catch(() => {
            setErrors(['Ошибка получения данных']);
        });
    }, [user.token]);

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 border-b border-zinc-200 pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Список тестов</h1>
                    <p className="text-sm text-gray-500">Управляйте контентом и просматривайте результаты</p>
                </div>
                <Link
                    to={PATHS.TEACHER.CREATE_TEST}
                    className="mt-3 md:mt-0 flex items-center gap-2 px-4 py-2 bg-gradient-to-bl from-blue-700 to-blue-900 text-white text-sm font-medium rounded-lg active:shadow-lg active:scale-95 shadow-sm transition-all"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    Создать тест
                </Link>
            </div>

            <ErrorAlert errors={errors} />

            {errors.length === 0 && (
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testsData.map((test) => (
                        <div
                            key={test.id}
                            className="flex flex-col p-5 bg-white border border-zinc-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="p-2 bg-zinc-100 text-blue-900 rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                        <polyline points="14 2 14 8 20 8" />
                                    </svg>
                                </div>
                                <span className="text-[11px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">
                                    ID: {test.id}
                                </span>
                            </div>

                            <h2 className="text-lg font-bold text-gray-800 mb-1 leading-tight">
                                {test.name}
                            </h2>

                            <p className="text-sm text-gray-500 line-clamp-2 h-10 mb-1">
                                {test.description}
                            </p>

                            <div className="mt-auto pt-2 border-t border-zinc-100 flex flex-col gap-3">
                                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                                    </svg>
                                    {test.tasks_count} заданий(я)
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <Link
                                        to={PATHS.TEACHER.toTest(test.id)}
                                        className="flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold rounded-lg transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                        Изменить
                                    </Link>
                                    <Link
                                        to={PATHS.TEACHER.toStatisticsTest(test.id)}
                                        className="flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-bold rounded-lg transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>
                                        Статистика
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
