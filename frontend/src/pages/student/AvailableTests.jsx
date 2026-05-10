import {useAuth} from "../../context/AuthContext.jsx";
import React, {useEffect, useState} from "react";
import TestsList from "../../components/TestList.jsx";
import ErrorAlert from "../../components/ErrorAlert.jsx";
import {PATHS} from "../../config/path.js";
import {getAvailableTests} from "../../services/testServices.jsx";

export default function AvailableTests() {
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
        getAvailableTests(user.token)
            .then((res) => {
                if (res.data.length > 0) {
                    const formattedData = res.data.map(test => ({
                        ...test,
                        link: PATHS.STUDENT.toTest(test.id)
                    }));
                    setTestsData(formattedData);
                } else {
                    setErrors(['Нет доступных тестов']);
                }
            }).catch(() => {
            setErrors(['Ошибка получения данных']);
        });
    }, []);
    return (<>
        <div className="max-w-6xl mx-auto p-6">
            <ErrorAlert errors={errors}/>
            {testsData[0].id && (
                <TestsList tests={testsData}/>
            )}
        </div>
    </>)
}
