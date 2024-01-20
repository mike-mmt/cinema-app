import axios from 'axios';
import { useContext, useEffect, useReducer, useState } from 'react';
import MovieCard from './MovieCard';
import { AdminContext } from '../../contexts/AdminContext';
import LinkButton from '../LinkButton';
import StaticGradientBg from '../StaticGradientBg';
import { ScreeningType } from '../../utils/screeningsUtils';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fetchScreenings } from '../../utils/fetchScreenings';
import { BsThreeDots } from 'react-icons/bs';

export interface MovieType {
	_id: string;
	title: string;
	year: string;
	genres: string[];
	director: string;
	actors: string[];
	screenings: ScreeningType[];
	photoUrl: string;
	trailerUrl: string;
	galleryPhotoUrls: string[];
	isCurrentlyScreening?: boolean;
}
interface ActionType {
	type: string;
	payload: MovieType[] | ScreeningType[];
}

function reducer(state: MovieType[], action: ActionType): MovieType[] {
	switch (action.type) {
		case 'set':
			return action.payload as MovieType[];
		// case 'sort':
		// return state;
		case 'setScreenings':
			return state.map((movie) => {
				movie.screenings = (action.payload as ScreeningType[]).filter(
					(screening) => screening.movieId === movie._id,
				);
				return movie;
			});
		default:
			throw new Error();
	}
}

export default function Repertoire() {
	const [state, dispatch] = useReducer<
		(state: MovieType[], action: ActionType) => MovieType[]
	>(reducer, []);
	const adminContext = useContext(AdminContext);
	const [startDate, setStartDate] = useState(new Date());

	useEffect(() => {
		axios
			.get(import.meta.env.VITE_BACKEND_URL + '/movies')
			.then((response) => {
				console.log(response);

				const dispatchBody = {
					type: 'set',
					payload:
						response.status === 200
							? response.data
							: ([] as MovieType[]),
				};
				dispatch(dispatchBody);
			});
	}, []);

	const handleFetchScreenings = async () => {
		const response = await fetchScreenings(
			new Date(startDate.setHours(0, 0, 0, 0)),
			new Date(startDate.setHours(23, 59, 59, 999)),
		);
		// console.log(
		// 	response.map((screening: ScreeningType) =>
		// 		screening.date.toString(),
		// 	),
		// );
		const dispatchBody = {
			type: 'setScreenings',
			payload:
				response?.status === 200
					? response.data
					: ([] as ScreeningType[]),
		};
		dispatch(dispatchBody);
	};

	useEffect(() => {
		handleFetchScreenings();
	}, [startDate]);

	return (
		<StaticGradientBg styles='flex justify-center bg-fixed'>
			{/* <div className="background-all h-screen "> */}
			<div className='movies-wrapper w-11/12 flex flex-col items-center mt-8'>
				{adminContext?.isAdmin && (
					<LinkButton
						link='/addmovie'
						text='Dodaj nowy film'
						styles='mb-5'
					/>
				)}
				<h1 className='text-4xl font-semibold w-full text-center pb-4 border-b-2 border-b-outer-space-half'>
					Repertuar
				</h1>
				<DatePicker
					selected={startDate}
					onChange={(date: Date) => {
						setStartDate(date); //useEffect will handle fetching screenings
					}}
					className='cursor-pointer bg-transparent py-2 border-b-2 border-magnolia text-center text-xl font-semibold focus:outline focus:outline-magnolia'
					dateFormat='dd.MM'
				/>
				{state.length === 0 && (
					<BsThreeDots className='mt-8' size={'3em'} />
				)}
				<div className='movies-grid grid grid-cols-2 w-full mt-4 gap-x-8 gap-y-10 px-2'>
					{state
						.filter((m) => m.isCurrentlyScreening)
						.map((movie: MovieType, index: number) => (
							<MovieCard key={index} movie={movie} />
						))}
					{adminContext?.isAdmin &&
						state
							.filter((m) => !m.isCurrentlyScreening)
							.map((movie: MovieType, index: number) => (
								<MovieCard key={index} movie={movie} />
							))}
				</div>
			</div>
		</StaticGradientBg>
	);
}
