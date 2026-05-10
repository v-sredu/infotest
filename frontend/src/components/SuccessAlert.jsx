import React from 'react';

const SuccessAlert = ({ message }) => {
	if (!message || message.length === 0) return null;

	return (
		<div className="my-2 bg-green-100 text-green-900 p-4 rounded-lg shadow-sm border border-green-200 mb-6" role="alert">
			<p className="block text-sm font-medium sm:inline max-sm:mt-2">
				{message}
			</p>
		</div>
	);
};

export default SuccessAlert;
