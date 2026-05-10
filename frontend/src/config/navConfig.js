import {PATHS} from "./path.js";

export const navConfig = {
	teacher: [
		{ title: 'Тесты', path: PATHS.TEACHER.TESTS},
		{ title: 'Создать тест', path: PATHS.TEACHER.CREATE_TEST},
	],
	student: [
		{ title: 'Доступные тесты', path: PATHS.STUDENT.AVAILABLE_TESTS},
		{ title: 'Завершенные тесты', path: PATHS.STUDENT.PASSED_TESTS},
	],
};
