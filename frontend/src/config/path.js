export const PATHS = {
	LOGIN: '/login',
	REGISTER: '/register',
	ALL: '*',
	STUDENT: {
		PROFILE: '/student/profile',
		AVAILABLE_TESTS: '/student/tests/available',
		PASSED_TESTS: '/student/tests/passed',
		TEST: '/student/test/:id',
		toTest: (id) => `/student/test/${id}`,
	},
	TEACHER: {
		PROFILE: '/teacher/profile',
		CREATE_TEST: '/teacher/create/test',
		TEST: '/teacher/test/:id',
        STATISTICS_TEST: '/teacher/test/:id/statistics',
		TESTS: '/teacher/tests',
		toTest: (id) => `/teacher/test/${id}`,
		toStatisticsTest: (id) => `/teacher/test/${id}/statistics`,
	}
};
