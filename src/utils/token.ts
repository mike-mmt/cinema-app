import axios from 'axios';
import { getCookie, setCookie, removeCookie } from 'typescript-cookie';

export function setToken(token: string, isAdmin: boolean = false) {
	setCookie('token', token, { expires: 7 });
	setCookie('isAdmin', isAdmin.toString(), { expires: 7 });
	axios.defaults.headers.common['Authorization'] = token;
}

export function getTokenIfExists(
	setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>,
	setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>,
) {
	const cookieToken = getCookie('token');
	const cookieIsAdmin = getCookie('isAdmin');
	if (cookieToken) {
		axios.defaults.headers.common['Authorization'] = cookieToken;
		setLoggedIn(true);
		if (cookieIsAdmin === 'true') {
			setIsAdmin(true);
		}
	}
}

export function logOut(
	setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>,
	setIsAdmin: React.Dispatch<React.SetStateAction<boolean>> | undefined,
) {
	removeCookie('token');
	removeCookie('isAdmin');
	delete axios.defaults.headers.common['Authorization'];
	setLoggedIn(false);
	if (setIsAdmin) {
		setIsAdmin(false);
	}
}
