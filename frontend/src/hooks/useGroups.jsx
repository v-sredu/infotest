import { useState, useEffect } from 'react';
import { getGroups } from "../services/studentServices";

export const useGroups = () => {
	const [groups, setGroups] = useState([]);
	useEffect(() => {
		getGroups()
			.then(res => setGroups(res.data))
			.catch(err => console.error("Ошибка групп", err));
	}, []);
	return { groups };
};
