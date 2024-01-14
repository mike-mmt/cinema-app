import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import NavigationBar from './components/NavigationBar';
import Repertoire from './components/repertoire/Repertoire';
import { LoginContext } from './contexts/LoginContext';
import { useEffect, useState } from 'react';
import Register from './components/register/Register';
import Login from './components/login/Login';
import { getTokenIfExists } from './utils/token';
import { AdminContext } from './contexts/AdminContext';
import AddMovie from './components/addmovie/AddMovie';
import Movie from './components/movie/Movie';

function App() {
	const [loggedIn, setLoggedIn] = useState<boolean>(false);
	const [isAdmin, setIsAdmin] = useState<boolean>(false);

	useEffect(() => {
		getTokenIfExists(setLoggedIn, setIsAdmin);
	}, []);

	return (
		<div className='flex flex-col'>
			<LoginContext.Provider value={{ loggedIn, setLoggedIn }}>
				<AdminContext.Provider value={{ isAdmin, setIsAdmin }}>
					<NavigationBar />
					<Routes>
						<Route path='/' element={<Home />} />
						<Route path='/repertoire' element={<Repertoire />} />
						<Route path='/register' element={<Register />} />
						<Route path='/login' element={<Login />} />
						<Route path='/addmovie' element={<AddMovie />} />
						<Route path='/movie/:movieId' element={<Movie />} />

						{/* <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/products" element={<Products />} />
          <Route path="/contact" element={<Contact />} /> */}
					</Routes>
				</AdminContext.Provider>
			</LoginContext.Provider>
		</div>
	);
}

export default App;
