import { MovieType } from './Repertoire';
import { useNavigate } from 'react-router';
import ScreeningsList from '../ScreeningsList';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import React, { useContext, useState } from 'react';
import { AdminContext } from '../../contexts/AdminContext';
import axios from 'axios';

type Props = { movie: MovieType };

export default function MovieCard({ movie }: Props) {
	const navigate = useNavigate();
	const adminContext = useContext(AdminContext);

	const handleCardClick = () => {
		navigate(`/movie/${movie._id}`);
	};

	const [notCurrentlyScreeningStyle, setNotCurrentlyScreeningStyle] = useState(
		movie.isCurrentlyScreening ? '' : ' opacity-50',
	);

	const handleToggleCurrentlyScreening = (e: React.MouseEvent) => {
		e.stopPropagation();
		axios
			.patch(import.meta.env.VITE_BACKEND_URL + '/movie/' + movie._id, {
				isCurrentlyScreening: (!movie.isCurrentlyScreening).toString(),
			})
			.then((response) => {
				console.log(response);

				if (response.status === 200) {
					movie.isCurrentlyScreening = !movie.isCurrentlyScreening;
					setNotCurrentlyScreeningStyle(movie.isCurrentlyScreening ? '' : ' opacity-50');
				}
			});
	};

	return (
		<div
			className={
				'relative grid-item flex items-center bg-outer-space-quarter hover:bg-outer-space-8th transition-colors duration-200 rounded-md p-2 ' +
				notCurrentlyScreeningStyle
			}
			onClick={handleCardClick}
		>
			<img src={movie.photoUrl} className='m-4 w-4/12'></img>
			<div className='info flex flex-col w-full'>
				<div className='title-genres-wrapper border-b-2 pb-4 border-b-outer-space-quarter'>
					<h2 className='break-normal text-xl font-semibold text-center '>{movie.title}</h2>
				</div>
				<div className='flex items-center mt-4 gap-2'>
					<ScreeningsList screenings={movie.screenings} />
				</div>
			</div>
			{adminContext?.isAdmin &&
				((movie.isCurrentlyScreening && (
					<>
						<FaEyeSlash
							className='peer absolute top-0 right-0 m-2 hover:text-rosered duration-100 hover:cursor-pointer '
							size={'1.5em'}
							onClick={(e) => handleToggleCurrentlyScreening(e)}
						/>
						<div className='invisible peer-hover:visible absolute top-8 right-0 m-2 rounded-md bg-gunmetal text-magnolia '>
							Przełącz film na nieaktywny
						</div>
					</>
				)) || (
					<>
						<FaEye
							className='peer absolute top-0 right-0 m-2 hover:text-rosered duration-100 hover:cursor-pointer'
							size={'1.5em'}
							onClick={(e) => handleToggleCurrentlyScreening(e)}
						/>
						<div className='invisible peer-hover:visible absolute top-8 right-0 m-2 rounded-md bg-gunmetal text-magnolia '>
							Przełącz film na aktywny
						</div>
					</>
				))}
		</div>
	);
}
