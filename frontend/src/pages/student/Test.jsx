import {useAuth} from "../../context/AuthContext.jsx";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getStudentTest, verifyTest} from "../../services/testServices.jsx";
import {nanoid} from "nanoid";
import ErrorAlert from "../../components/ErrorAlert.jsx";
import SuccessAlert from "../../components/SuccessAlert.jsx";

export default function Test() {
    const {user} = useAuth();
    const {id} = useParams();
    const [errors, setErrors] = useState([]);
    const [disable, setDisable] = useState(false);
    const [isAccess, setIsAccess] = useState(false);
    const [successAlert, setSuccessAlert] = useState([]);
    const [testData, setTestData] = useState({
        id: '',
        name: '',
        description: '',
    });
    const [tasks, setTasks] = useState([{
        id: nanoid(),
        question_title: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_option: 'A'
    }]);
    const [userAnswers, setUserAnswers] = useState([])
    const handleSelect = (task_id, option) => {
        setUserAnswers(prev => ({
            ...prev,
            [task_id]: option
        }));
    };

    useEffect(() => {
        getStudentTest(user.token, id)
            .then((res) => {
                const data = res.data;
                setTasks(data.tasks);
                setTestData({
                    id: data.id,
                    name: data.name,
                    description: data.description
                });
                setIsAccess(true);
            })
            .catch((error) => {
                // Проверяем, что ответ от сервера вообще пришел
                if (error.response && error.response.data) {
                    // Устанавливаем массив ошибок из ответа
                    setErrors(error.response.data.errors);
                } else {
                    setErrors(['Произошла непредвиденная ошибка']);
                }
                setIsAccess(false);
            });
    }, [id, user.token]);

    const submit = (e) => {
        e.preventDefault();
        setErrors([]);
        const answers = Object.entries(userAnswers).map((answer) => (
            {task_id: answer[0], option: answer[1]}))
        const dataSubmit = {
            answers: answers
        }
        verifyTest(user.token, testData.id, dataSubmit)
            .then((res) => {
                // console.log(res.data)
                setSuccessAlert(['Ваш результат: ' + res.data.result]);
                setDisable(true);
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            })
            .catch((error) => {
                if (error.response) {
                    const status = error.response.status;
                    const data = error.response.data;
                    if (status >= 400 && status < 500) {
                        setErrors(data.errors || ["Произошла ошибка при отправке данных"]);
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
        <div className="bg-white py-4 px-2">
            <div className="max-w-5xl mx-auto"> {/* Увеличили ширину, чтобы всё влезло в строку */}
                {/* Компактная шапка */}
                <div className="border-b-3 border-zinc-200 pb-2">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold uppercase">
                            {testData.name || "---"}
                        </h1>
                        <div className="text-[10px] font-bold px-2 py-0.5 border border-blue-900 rounded">
                            №{testData.id}
                        </div>
                    </div>
                    <p className="mt-2">{testData.description}</p>
                </div>
                <ErrorAlert errors={errors}/>
                <SuccessAlert message={successAlert} />
                {/* Список вопросов */}
                {isAccess && (
                    <>
                        <div className="flex flex-col gap-6 mt-6">
                            {tasks.map((task, index) => (
                                <div key={task.id}>
                                    {/* Номер и текст вопроса — фиксированная ширина для выравнивания */}
                                    <h3 className="text-md font-semibold">
                                        {index + 1}. {task.question_title}
                                    </h3>

                                    {/* Варианты ответов строго в строку */}
                                    <div className="flex flex-col items-start mt-2 gap-2">
                                        {['a', 'b', 'c', 'd'].map((letter) => {
                                            const optionKey = `option_${letter}`;
                                            const optionText = task[optionKey];
                                            if (!optionText) return null;
                                            return (
                                                <label
                                                    key={letter}
                                                    className="flex items-center gap-2 cursor-pointer group flex-1 min-w-0"
                                                >
                                                    <input
                                                        type="radio"
                                                        name={`task-${task.id}`}
                                                        disabled={disable}
                                                        value={letter.toUpperCase()}
                                                        onChange={() => handleSelect(task.id, letter.toUpperCase())}
                                                        className="w-3 h-3 accent-blue-900"
                                                    />
                                                    <p>{optionText}</p>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={submit}
                                disabled={disable}
                                className="px-3 py-1 bg-blue-900 hover:bg-blue-800 text-white text-sm transition-all rounded shadow-sm cursor-pointer
                                disabled:bg-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed"
                            >
                                Завершить тест
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
