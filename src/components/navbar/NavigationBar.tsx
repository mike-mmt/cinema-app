import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import LinkButton from '../LinkButton';
import { useContext } from 'react';
import { LoginContext } from '../../contexts/LoginContext';
import { AdminContext } from '../../contexts/AdminContext';
import { logOut } from '../../utils/token';

export default function NavigationBar() {
	const loginContext = useContext(LoginContext);
	const adminContext = useContext(AdminContext);
	const navigate = useNavigate();

	return (
		<div className='navbar z-50 bg-black flex p-1 justify-between items-center w-full h-20'>
			<div className='m-6 flex items-center gap-10'>
				<Logo />
				<Link
					to={'/repertoire'}
					className='text-outer-space hover:text-magnolia transition-colors duration-100 active:text-rosered'
				>
					Repertuar
				</Link>
			</div>
			{loginContext?.loggedIn ? (
				<div className='flex items-center gap-4'>
					{adminContext?.isAdmin && (
						<button
							className='bg-rosered text-magnolia min-h-10 min-w-48 rounded flex justify-center items-center align-middle duration-150 active:bg-transparent active:border-2 active:border-magnolia active:text-rosered'
							onClick={() => navigate('/stats')}
						>
							Statystyki sprzedaży
						</button>
					)}
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
