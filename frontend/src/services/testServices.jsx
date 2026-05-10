import axios from "axios";

const APP_URL = import.meta.env["VITE_API_URL"];

// Общие
// Студент
export const getStudentTest = (token, id) =>
    axios.get(`${APP_URL}/student/test/${id}`, {
        headers: {Authorization: `Bearer ${token}`}
    });

// Студент
export const getStudentTests = (token) =>
    axios.get(`${APP_URL}/student/tests`, {
    headers: {Authorization: `Bearer ${token}`}
});
export const getAvailableTests = (token, id) =>
    axios.get(`${APP_URL}/student/tests?status=available`, {
        headers: {Authorization: `Bearer ${token}`}
    });
export const getPassedTests = (token, id) =>
    axios.get(`${APP_URL}/student/tests?status=passed`, {
        headers: {Authorization: `Bearer ${token}`}
    });
export const verifyTest = (token, id, data) => {
    return axios.post(`${APP_URL}/student/test/${id}/submit`, data, {
        headers: {Authorization: `Bearer ${token}`}
    });
}

// Учитель
export const getTeacherTests = (token) => axios.get(`${APP_URL}/teacher/tests`, {
    headers: {Authorization: `Bearer ${token}`}
});
export const getTeacherTest = (token, id) =>
    axios.get(`${APP_URL}/teacher/test/${id}`, {
        headers: {Authorization: `Bearer ${token}`}
    });

export const createTest = (token, data) => {
    return axios.post(`${APP_URL}/teacher/test`, data, {
        headers: {Authorization: `Bearer ${token}`}
    });
}

export const updateTest = (token, id, data) => {
    return axios.put(`${APP_URL}/teacher/test/${id}`, data, {
        headers: {Authorization: `Bearer ${token}`}
    });
}

export const deleteTest = (token, id) => {
    return axios.delete(`${APP_URL}/teacher/test/${id}`, {
        headers: {Authorization: `Bearer ${token}`}
    });
}
export const getStatisticsTest = (token, id) =>
    axios.get(`${APP_URL}/teacher/test/${id}/statistics`, {
        headers: {Authorization: `Bearer ${token}`}
    });
