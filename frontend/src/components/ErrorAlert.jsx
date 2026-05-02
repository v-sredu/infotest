import React from 'react';

const ErrorAlert = ({ errors }) => {
	// Если ошибок нет, ничего не рендерим
	if (!errors || errors.length === 0) return null;

	return (
		<div className="bg-red-100 text-red-800 p-4 rounded-lg" role="alert">
			{errors.map((error, index) => (
				<p key={index} className="block text-sm font-medium max-sm:mt-2">
					{error}
				</p>
			))}
		</div>
	);
};

export default ErrorAlert;
