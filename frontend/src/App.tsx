import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import NavigationBar from './components/navbar/NavigationBar';
import Repertoire from './components/repertoire/Repertoire';
import { LoginContext } from './contexts/LoginContext';
import { useEffect, useRef, useState } from 'react';
import Register from './components/register/Register';
import Login from './components/login/Login';
import { getTokenIfExists } from './utils/token';
import { AdminContext } from './contexts/AdminContext';
import AddMovie from './components/addmovie/AddMovie';
import Movie from './components/movie/Movie';
import Screening from './components/screening/Screening';
import { PricesContext, PricesType } from './contexts/PricesContext';
import axios from 'axios';
import OrderSummary from './components/ordersummary/OrderSummary';
import Order from './components/ordersummary/Order';
import Stats from './components/stats/Stats';
import NotFound from './components/NotFound';
import Account from './components/account/Account';

function App() {
	const [loggedIn, setLoggedIn] = useState<boolean>(false);
	const [isAdmin, setIsAdmin] = useState<boolean>(false);
	const prices = useRef<PricesType | undefined>(undefined);

	useEffect(() => {
		getTokenIfExists(setLoggedIn, setIsAdmin);
	}, []);

	useEffect(() => {
		axios.get(process.env.BACKEND_URL + '/prices').then((res) => {
			if (res.status === 200) {
				// console.log(res.data);

				prices.current = res.data;
				// console.log(prices.current);
			}
		});
	}, []);
	return (
		<div className='flex flex-col'>
			<LoginContext.Provider value={{ loggedIn, setLoggedIn }}>
				<AdminContext.Provider value={{ isAdmin, setIsAdmin }}>
					<PricesContext.Provider value={prices}>
						<NavigationBar />
						<Routes>
							<Route path='/' element={<Home />} />
							<Route path='/repertoire' element={<Repertoire />} />
							<Route path='/register' element={<Register />} />
							<Route path='/login' element={<Login />} />
							<Route path='/addmovie' element={<AddMovie />} />
							<Route path='/movie/:movieId' element={<Movie />} />
							<Route path='/screening/:screeningId' element={<Screening />} />
							<Route path='ordersummary' element={<OrderSummary />} />
							<Route path='/order' element={<Order />} />
							<Route path='/stats' element={<Stats />} />
							<Route path='/account' element={<Account />} />
							<Route path='*' element={<NotFound />} />
						</Routes>
					</PricesContext.Provider>
				</AdminContext.Provider>
			</LoginContext.Provider>
		</div>
	);
}

export default App;
