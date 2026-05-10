import React from 'react';
import {Link} from 'react-router-dom';

const TestsList = ({tests}) => {
	return (
		<div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{tests.map((test) => (
				<Link
					key={test.id}
					to={test.link}
					className="group block p-5 bg-white border border-zinc-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-900 transition-all duration-200"
				>
					<div className="flex justify-between items-start mb-3">
						<div
							className="p-2 bg-zinc-100 text-blue-900 rounded-lg group-hover:bg-blue-900 group-hover:text-white transition-colors duration-200">
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
								fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
								strokeLinejoin="round">
								<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
								<polyline points="14 2 14 8 20 8"/>
							</svg>
						</div>
						<span
							className="text-[11px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-1 rounded">
                ID: {test.id}
              </span>
					</div>

					<h2 className="text-lg font-bold text-gray-800 group-hover:text-blue-900 transition-colors">
						{test.name}
					</h2>

					<p className="mt-2 text-sm text-gray-500 line-clamp-2 h-10">
						{test.description}
					</p>

					<div className="mt-5 pt-4 border-t border-zinc-100 flex justify-between items-center text-sm">
						<div className="flex items-center gap-1.5 text-gray-600 font-medium">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
								fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
								strokeLinejoin="round" className="text-gray-400">
								<path d="M9 11l3 3L22 4"/>
								<path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
							</svg>
							{test.tasks_count} заданий(я)
						</div>
						<span
							className="text-blue-900 opacity-0 group-hover:opacity-100 transition-opacity font-semibold flex items-center gap-1">
                Изменить
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
					stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path
					d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
					</div>
				</Link>
			))}
		</div>
	)
}

export default TestsList;
