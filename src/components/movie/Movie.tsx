import { useParams } from 'react-router-dom';
import StaticGradientBg from '../StaticGradientBg';
import { useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { MovieType } from '../repertoire/Repertoire';
import ScreeningsList from '../ScreeningsList';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ScreeningType } from '../../utils/screeningsUtils';
import AddScreening from './AddScreening';
import { AdminContext } from '../../contexts/AdminContext';
import { fetchScreenings } from '../../utils/fetchScreenings';

export default function Movie() {
	const { movieId } = useParams();
	const [movie, setMovie] = useState<MovieType | undefined>(undefined);
	const [startDate, setStartDate] = useState(new Date());
	const [screenings, setScreenings] = useState<ScreeningType[]>([]);
	const [showAddScreening, setShowAddScreening] = useState(false);
	const adminContext = useContext(AdminContext);

	async function handleFetchScreenings() {
		const response = await fetchScreenings(
			new Date(startDate.setHours(0, 0, 0, 0)),
			new Date(startDate.setHours(23, 59, 59, 999)),
			movieId,
		);
		setScreenings(response);
	}

	useEffect(() => {
		axios
			.get(import.meta.env.VITE_BACKEND_URL + '/movie/' + movieId, {
				params: {
					from: new Date(startDate.setHours(0, 0, 0, 0)),
					to: new Date(startDate.setHours(23, 59, 59, 999)),
				},
			})
			.then((response) => {
				setMovie(response.data);
				setScreenings(response.data.screenings);
			});
	}, [movieId]);

	useEffect(() => {
		// fetches screenings when date changes or whena new screening is added
		if (!showAddScreening) {
			handleFetchScreenings();
		}
	}, [showAddScreening, startDate]);

	return (
		<StaticGradientBg>
			<div className='content-wrapper bg m-6 p-2 pb-12 bg-outer-space-half rounded-md'>
				<div className='inside-content-wrapper h-screen'>
					<div className='movie-wrapper flex h-[80vh]'>
						<img src={movie?.photoUrl} className='m-4 h-full'></img>
						<div className='info-and-screenings flex flex-col grow'>
							<div className='movie-info-wrapper flex flex-col items-center mx-4 p-6 border-b-2 border-b-slate-500 h-fit'>
								<h1 className='text-3xl mt-4'>
									{movie?.title}
								</h1>
								<div className='flex items-center gap-2 mt-4 text-sm pb-4 border-b-2 border-b-slate-500'>
									<p className='text-slate-400'>
										{movie?.year}
									</p>
									{movie?.genres.map((genre, index) => (
										<p
											key={index}
											className='text-slate-400 border-l-2 border-slate-400 ml-2 pl-4'
										>
											{genre}
										</p>
									))}
								</div>
								<div className='flex max-w-4/5 mt-4 justify-center items-center w-full'>
									<div className='flex w-2/5 flex-col items-center'>
										<p className='text-slate-300'>
											Reżyseria
										</p>
										<p className='text-slate-400'>
											{movie?.director}
										</p>
									</div>
									<div className='flex w-2/5 flex-col items-center'>
										<p className='text-slate-300'>Obsada</p>
										<div className='flex flex-wrap w-3/5 text-center'>
											{movie?.actors.map(
												(actor, index) => (
													<p
														key={index}
														className='text-slate-400 mr-1'
													>
														{actor +
															(index !==
															movie.actors
																.length -
																1
																? ', '
																: '')}
													</p>
												),
											)}
										</div>
									</div>
								</div>
							</div>
							<div className='screenings-wrapper mt-5 ml-12'>
								<DatePicker
									selected={startDate}
									onChange={(date: Date) => {
										setStartDate(date);
										// handleNewScreenings(); // -> not needed, useEffect will handle it
									}}
									className='cursor-pointer bg-transparent py-2 border-b-2 border-magnolia text-center text-xl font-semibold focus:outline focus:outline-magnolia'
									dateFormat='dd.MM'
								/>
								<div className='flex items-center mt-4 gap-2'>
									<ScreeningsList screenings={screenings} />
									{adminContext?.isAdmin && (
										<p
											onClick={() =>
												setShowAddScreening(true)
											}
											className='cursor-pointer bg-outer-space-quarter border border-magnolia hover:border-rosered hover:text-rosered hover:bg-transparent transition-colors duration-100 px-6 py-3 w-fit rounded-md text-lg text-center align-middle'
										>
											+
										</p>
									)}
								</div>

								{showAddScreening && (
									<AddScreening
										initialDate={startDate}
										setShow={setShowAddScreening}
										movieId={movieId}
									/>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</StaticGradientBg>
	);
}
