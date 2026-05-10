import { useAuth } from "../../context/AuthContext.jsx";
import React, { useEffect, useState } from "react";
import ErrorAlert from "../../components/ErrorAlert.jsx";
import { getStatisticsTest } from "../../services/testServices.jsx";
import { useParams, Link } from "react-router-dom";
import { PATHS } from "../../config/path.js";

export default function StatisticsTest() {
    const { user } = useAuth();
    const [errors, setErrors] = useState([]);
    const [stats, setStats] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        getStatisticsTest(user.token, id)
            .then((res) => setStats(res.data))
            .catch((err) => setErrors(err.response?.data?.errors || ['Ошибка доступа']));
    }, [id, user.token]);

    if (!stats && errors.length === 0) return <div className="p-4 text-center text-xs text-gray-500">Загрузка...</div>;

    return (
        <div className="w-full">
            {/* Шапка */}
            <div className="flex items-center gap-3 mb-4">
                <Link to={PATHS.TEACHER.TESTS} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                </Link>
                <h1 className="text-xl font-bold text-gray-800 truncate">{stats?.name}</h1>
            </div>

            <ErrorAlert errors={errors} />

            {stats && (
                <div className="space-y-3">
                    {/* Инфо-панель */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white p-2.5 rounded-lg border border-zinc-200">
                            <span className="block text-[9px] text-gray-400 uppercase font-bold tracking-wider">Всего</span>
                            <span className="text-lg font-black text-zinc-800">{stats.total_passes}</span>
                        </div>
                        <div className="bg-white p-2.5 rounded-lg border border-zinc-200">
                            <span className="block text-[9px] text-gray-400 uppercase font-bold tracking-wider">Ср. балл</span>
                            <span className="text-lg font-black text-blue-900">{Math.round(stats.average_score)}%</span>
                        </div>
                    </div>

                    {/* Таблица */}
                    <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
                        <table className="w-full text-left text-sm border-separate border-spacing-0">
                            <thead className="bg-zinc-50 border-b border-zinc-200">
                            <tr>
                                <th className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-tight">Студент</th>
                                <th className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-tight text-right">Результат</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                            {stats.results.length > 0 ? stats.results.map((res) => (
                                <tr key={res.id} className="hover:bg-zinc-50 transition-colors">
                                    <td className="px-4 py-2.5">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-800 text-sm">{res.student_name}</span>
                                            <span className="text-[10px] text-gray-500 bg-zinc-100 px-1.5 py-0.5 rounded font-medium">
                                                    {res.group_name}
                                                </span>
                                        </div>
                                        <div className="text-[10px] text-gray-400 mt-0.5">{res.date}</div>
                                    </td>
                                    <td className="px-4 py-2.5 text-right">
                                        <div className={`text-sm font-black ${res.score >= 50 ? 'text-green-600' : 'text-red-500'}`}>
                                            {res.score}%
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="2" className="px-4 py-8 text-center text-gray-400 text-xs">Нет данных</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
