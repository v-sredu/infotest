import {useState} from "react";
import {Link, Outlet} from 'react-router-dom';
import {useAuth} from "../../context/AuthContext.jsx";
import {navConfig} from "../../config/navConfig.jsx";

export default function Layout() {
	const [isCollapsed, setIsCollapsed] = useState(true);
	const width = window.innerWidth;
	const {user, logOut} = useAuth();
	const menuItems = navConfig[user.role] || [];

	return (
		<div className="flex gap-5 text-gray-700">
			<aside
				className={`flex flex-col h-screen border-r border-r-zinc-300 bg-white
                ${isCollapsed ? 'w-20' : 'w-80'} ${width < 660 && !isCollapsed ? 'absolute z-100' : ''}`}>
				{/* Header */}
				<div className="relative border-b border-b-zinc-300 px-4 py-3">
					<div className="flex items-center space-x-3">
						<img
							src="https://plus.unsplash.com/premium_photo-1661962960694-0b4ed303744f?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
							alt="App Name Logo"
							className="size-8 rounded-full"
						/>
						<span
							className={`
                            'text-lg font-bold text-gray-800 transition-opacity duration-200',
                            ${isCollapsed && 'hidden opacity-0'}`}>
            MyApp
          </span>
					</div>
					<button
						onClick={() => setIsCollapsed(!isCollapsed)}
						aria-label="Toggle Sidebar"
						className="absolute top-4 -right-3 cursor-pointer rounded-full border border-[#EBEDEE] text-blue-900 bg-white p-1 hover:bg-[#EBEDEE]"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
							className={`h-4 w-4 transition-transform duration-200 ${isCollapsed && 'rotate-180'}`}
							viewBox="0 0 16 16">
							<path
								d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
						</svg>
					</button>
				</div>

				{/* Navigation */}
				<nav className="flex-1 mt-2">
					<ul className="px-2">
						{menuItems.map((item, index) => (
							<li key={index} className="line-clamp-1 p-2 hover:bg-zinc-200 hover:text-[#355C7D] rounded-md">
								<Link to={item.path}>
                                    {item.title}
								</Link>
							</li>
						))
						}
					</ul>
				</nav>

				{/* Footer/User Section */}
				<div className="mt-auto border-t border-t-zinc-300">
					{/* User Profile */}
					<Link to={"/profile"}
						className="flex cursor-pointer items-center px-4 py-3 transition hover:bg-zinc-200">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
							className="text-blue-900 h-8 w-8" viewBox="0 0 16 16">
							<path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
							<path
								d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
						</svg>
						<div
							className={`ml-3 flex flex-col transition-opacity duration-200 ${
								isCollapsed && 'hidden opacity-0'}`}>
							<span className="text-sm font-medium text-gray-700">{user.name + ' ' + user.surname}</span>
							<span className="text-xs text-gray-500">{user.email}</span>
						</div>
					</Link>

					{/*user setting  */}

					<ul>
						<li className="p-4 hover:bg-zinc-200">
							<a className="flex gap-2" onClick={() => logOut()}>
								<svg className="w-6 h-6 text-blue-900" aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 16">
									<path stroke="currentColor"
										d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"></path>
								</svg>
								<div className={`mt-1 text-sm ${isCollapsed && 'hidden'}`}>Выйти</div>
							</a>
						</li>
					</ul>

					{/* Footer */}
					<div className="border-t border-t-zinc-300 px-4 py-3">
                          <span
							  className={`text-xs text-gray-400 transition-opacity duration-200
                                  ${isCollapsed && 'hidden opacity-0'}`}>
                            © 2025 MyApp
                          </span>
					</div>
				</div>
			</aside>
			<main className="flex-1 my-2 p-4 bg-white max-w-300">
				<Outlet/>
			</main>
		</div>
	)
}
