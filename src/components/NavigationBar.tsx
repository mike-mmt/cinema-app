import { Link } from 'react-router-dom';
import Logo from './navbar/Logo';
import LinkButton from './LinkButton';
import { useContext, useEffect } from 'react';
import { LoginContext } from '../contexts/LoginContext';
import { AdminContext } from '../contexts/AdminContext';
import { logOut } from '../utils/token';

export default function NavigationBar() {
	const loginContext = useContext(LoginContext);
	const adminContext = useContext(AdminContext);

	useEffect(() => {}, [adminContext?.isAdmin, loginContext?.loggedIn]);

	return (
		<div className='navbar z-50 bg-black flex p-1 justify-between items-center w-full h-20'>
			<div className='m-6 flex items-center gap-10'>
				<Logo />
				<Link to={'/repertoire'} className='text-outer-space'>
					Repertuar
				</Link>
			</div>
			{loginContext?.loggedIn ? (
				<div
					className='mr-8'
					onClick={() =>
						logOut(
							loginContext.setLoggedIn,
							adminContext?.setIsAdmin,
						)
					}
				>
					<LinkButton link='/' text='Wyloguj się' />
				</div>
			) : (
				// null bedzie przyciskiem "konto"
				<div className='m-6 flex items-center gap-6 font-medium tracking-wide'>
					<LinkButton link='/login' text='Zaloguj się' />
					<LinkButton link='/register' text='Utwórz konto' />
				</div>
			)}
		</div>
	);
}
