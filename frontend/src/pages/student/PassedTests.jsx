import {useAuth} from "../../context/AuthContext.jsx";
import React, {useEffect, useState} from "react";
import ErrorAlert from "../../components/ErrorAlert.jsx";
import {PATHS} from "../../config/path.js";
import {getPassedTests} from "../../services/testServices.jsx";

export default function PassedTests() {
    const {user} = useAuth();
    const [errors, setErrors] = useState([]);
    const [testsData, setTestsData] = useState([{
        id: '',
        name: '',
        description: '',
        link: '',
        tasks_count: 0
    }]);
    useEffect(() => {
        getPassedTests(user.token)
            .then((res) => {
                if (res.data.length > 0) {
                    const formattedData = res.data.map(test => ({
                        ...test,
                        link: PATHS.STUDENT.toTest(test.id)
                    }));
                    setTestsData(formattedData);
                } else {
                    setErrors(['Нет завершенных тестов']);
                }
            }).catch(() => {
            setErrors(['Ошибка получения данных']);
        });
    }, []);
    return (
        <div className="max-w-6xl mx-auto p-6">
            <ErrorAlert errors={errors}/>
            {testsData[0]?.id && (
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {testsData.map((test) => (
                        <div
                            key={test.id}
                            className="block p-4 bg-white border border-zinc-200 rounded-xl shadow-sm"
                        >
                            <div className="flex justify-between items-start mb-1">
                                <h2 className="text-md font-bold text-gray-800 leading-tight pr-2">
                                    {test.name}
                                </h2>
                                <span
                                    className="text-[10px] font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded whitespace-nowrap">
                            ID: {test.id}
                        </span>
                            </div>

                            {/* Компактный блок результата */}
                            {(test.result !== undefined || test.passed_at) && (
                                <div
                                    className="mt-3 py-2 px-3 bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span
                                            className="text-[10px] text-blue-700 font-semibold uppercase leading-none mb-1">Результат</span>
                                        <span
                                            className="text-xl font-black text-blue-900 leading-none">{test.result}%</span>
                                    </div>
                                    {test.passed_at && (
                                        <div className="text-right">
                                            <span
                                                className="text-[10px] text-blue-600 block leading-none mb-1">Завершено</span>
                                            <span
                                                className="text-[11px] font-medium text-blue-800 leading-none">{test.passed_at}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
