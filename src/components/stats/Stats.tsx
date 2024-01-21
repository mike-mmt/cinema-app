import { useEffect, useReducer, useState } from 'react';
import GrayContentWrapper from '../GrayContentWrapper';
import StaticGradientBg from '../StaticGradientBg';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import GridItem from './GridItem';
import GridMovieRow from './GridMovieRow';
import SortTitleButton from './SortTitleButton';
import { ActionType, SortBy, SortOrder, StatsState } from './StatsTypes';

const reducer = (state: StatsState, action: ActionType) => {
	switch (action.type) {
		case 'SET_TOTAL':
			return { ...state, allStats: action.payload || state.allStats };
		case 'SET_DAY_STATS':
			return { ...state, dayStats: action.payload || state.dayStats };
		case 'SET_MONTH_STATS':
			return { ...state, monthStats: action.payload || state.monthStats };
		case 'SET_YEAR_STATS':
			return { ...state, yearStats: action.payload || state.yearStats };
		case 'SET_SORT_BY':
			return action.sortBy
				? {
						...state,
						sortBy: action.sortBy,
						sortOrder:
							action.sortBy === state.sortBy &&
							state.sortOrder === SortOrder.DESC
								? SortOrder.ASC
								: SortOrder.DESC,
						// eslint-disable-next-line no-mixed-spaces-and-tabs
				  }
				: state;
		default:
			return state;
	}
};
const initialState: StatsState = {
	allStats: {
		total: 0,
		movies: [],
	},
	dayStats: {
		total: 0,
		movies: [],
	},
	monthStats: {
		total: 0,
		movies: [],
	},
	yearStats: {
		total: 0,
		movies: [],
	},
	sortBy: SortBy.DAY,
	sortOrder: SortOrder.DESC,
};

export default function Stats() {
	const [state, dispatch] = useReducer(reducer, initialState);
	const [day, setDay] = useState(new Date());
	const [month, setMonth] = useState(new Date());
	const [year, setYear] = useState(new Date());

	useEffect(() => {
		axios
			.get(import.meta.env.VITE_BACKEND_URL + '/orders/stats')
			.then((response) => {
				// console.log('total');
				// console.log(response.data);
				dispatch({
					type: 'SET_TOTAL',
					payload: response.data,
				});
			});

		fetchDayStats(day);
		fetchMonthStats(month);
		fetchYearStats(year);
	}, []);

	const fetchDayStats = async (date: Date) => {
		const response = await axios.get(
			import.meta.env.VITE_BACKEND_URL + '/orders/stats',
			{
				params: {
					dateFrom: new Date(date.setHours(0, 0, 0, 0)).toISOString(),
					dateTo: new Date(
						date.setHours(23, 59, 59, 999),
					).toISOString(),
				},
			},
		);
		dispatch({
			type: 'SET_DAY_STATS',
			payload: response.data || { total: 0, movies: [] },
		});
	};

	const fetchMonthStats = async (date: Date) => {
		const response = await axios.get(
			import.meta.env.VITE_BACKEND_URL + '/orders/stats',
			{
				params: {
					dateFrom: new Date(
						date.getFullYear(),
						date.getMonth(),
						1,
					).toISOString(),
					dateTo: new Date(
						date.getFullYear(),
						date.getMonth() + 1,
						0,
					).toISOString(),
				},
			},
		);
		// console.log(response);

		dispatch({
			type: 'SET_MONTH_STATS',
			payload: response.data || { total: 0, movies: [] },
		});
	};

	const fetchYearStats = async (date: Date) => {
		const response = await axios.get(
			import.meta.env.VITE_BACKEND_URL + '/orders/stats',
			{
				params: {
					dateFrom: new Date(
						date.getFullYear(),
						0,
						0,
						0,
						0,
						0,
						0,
					).toISOString(),
					dateTo: new Date(
						date.getFullYear(),
						11,
						31,
						0,
						0,
						0,
						0,
					).toISOString(),
				},
			},
		);
		dispatch({
			type: 'SET_YEAR_STATS',
			payload: response.data || { total: 0, movies: [] },
		});
	};

	const getSortedMovies = () => {
		const movies = state.allStats.movies.map((m) => {
			return {
				movie: m.movie,
				allTotal: m.totalPerMovie,
				dayTotal:
					state.dayStats.movies?.find(
						(dayMovie) => dayMovie.movie._id === m.movie._id,
					)?.totalPerMovie || 0,
				monthTotal:
					state.monthStats.movies?.find(
						(monthMovie) => monthMovie.movie._id === m.movie._id,
					)?.totalPerMovie || 0,
				yearTotal:
					state.yearStats.movies?.find(
						(yearMovie) => yearMovie.movie._id === m.movie._id,
					)?.totalPerMovie || 0,
			};
		});
		switch (state.sortBy) {
			case SortBy.DAY:
				return movies.sort((a, b) =>
					state.sortOrder === SortOrder.ASC
						? a.dayTotal - b.dayTotal
						: b.dayTotal - a.dayTotal,
				);
			case SortBy.MONTH:
				return movies.sort((a, b) =>
					state.sortOrder === SortOrder.ASC
						? a.monthTotal - b.monthTotal
						: b.monthTotal - a.monthTotal,
				);
			case SortBy.YEAR:
				return movies.sort((a, b) =>
					state.sortOrder === SortOrder.ASC
						? a.yearTotal - b.yearTotal
						: b.yearTotal - a.yearTotal,
				);
			case SortBy.ALL:
				return movies.sort((a, b) =>
					state.sortOrder === SortOrder.ASC
						? a.allTotal - b.allTotal
						: b.allTotal - a.allTotal,
				);
			case SortBy.NAME:
				return movies.sort((a, b) =>
					state.sortOrder === SortOrder.DESC // name sorting direction is inverted
						? a.movie.title.localeCompare(b.movie.title)
						: b.movie.title.localeCompare(a.movie.title),
				);
		}
	};

	return (
		<StaticGradientBg>
			<GrayContentWrapper>
				<div className='flex flex-col items-start p-8 pt-3'>
					<h1 className='font-semibold text-2xl w-full border-b-2 border-b-rosered p-2'>
						Statystyki sprzedaży
					</h1>
					<div className='statsTable grid grid-cols-5 p-4'>
						<GridItem className='col-start-1 row-start-1 flex flex-col'>
							<SortTitleButton
								sortBy={SortBy.NAME}
								state={state}
								dispatch={dispatch}
							>
								Tytuł
							</SortTitleButton>
						</GridItem>
						<GridItem className='col-start-2 row-start-1 flex flex-col'>
							<SortTitleButton
								sortBy={SortBy.DAY}
								state={state}
								dispatch={dispatch}
							>
								Dzień
							</SortTitleButton>
							<DatePicker
								selected={day}
								onChange={(date: Date) => {
									setDay(date);
									fetchDayStats(date);
								}}
								className='cursor-pointer bg-transparent py-2 w-full border-b-2 border-rosered text-center text-xl font-semibold focus:outline focus:outline-rosered'
								dateFormat='dd.MM'
							/>
						</GridItem>
						<GridItem className='col-start-3 row-start-1 flex flex-col'>
							<SortTitleButton
								sortBy={SortBy.MONTH}
								state={state}
								dispatch={dispatch}
							>
								Miesiąc
							</SortTitleButton>
							<DatePicker
								selected={month}
								onChange={(date: Date) => {
									setMonth(date);
									fetchMonthStats(date);
								}}
								className='cursor-pointer bg-transparent py-2 w-full border-b-2 border-rosered text-center text-xl font-semibold focus:outline focus:outline-rosered'
								dateFormat='MM/yyyy'
								showMonthYearPicker
							/>
						</GridItem>
						<GridItem className='col-start-4 row-start-1 flex flex-col'>
							<SortTitleButton
								sortBy={SortBy.YEAR}
								state={state}
								dispatch={dispatch}
							>
								Rok
							</SortTitleButton>
							<DatePicker
								selected={year}
								onChange={(date: Date) => {
									setYear(date);
									fetchYearStats(date);
								}}
								className='cursor-pointer bg-transparent py-2 w-full border-b-2 border-rosered text-center text-xl font-semibold focus:outline focus:outline-rosered'
								dateFormat='yyyy'
								showYearPicker
							/>
						</GridItem>
						<GridItem className='col-start-5 row-start-1'>
							<SortTitleButton
								sortBy={SortBy.ALL}
								state={state}
								dispatch={dispatch}
							>
								Całość
							</SortTitleButton>
						</GridItem>

						<GridItem className='col-start-1 row-start-2'>
							<p className='text-lg font-semibold'>
								Całkowity przychód
							</p>
						</GridItem>
						<GridItem className='col-start-2 row-start-2'>
							<p className='font-semibold'>
								{(state.dayStats &&
									state.dayStats.total.toFixed(2)) ||
									0}{' '}
								zł
							</p>
						</GridItem>
						<GridItem className='col-start-3 row-start-2'>
							<p className='font-semibold'>
								{(state.monthStats &&
									state.monthStats.total.toFixed(2)) ||
									0}{' '}
								zł
							</p>
						</GridItem>
						<GridItem className='col-start-4 row-start-2'>
							<p className='font-semibold'>
								{(state.yearStats &&
									state.yearStats.total.toFixed(2)) ||
									0}{' '}
								zł
							</p>
						</GridItem>
						<GridItem className='col-start-5 row-start-2'>
							<p className='font-semibold'>
								{state.allStats &&
									state.allStats.total.toFixed(2)}{' '}
								zł
							</p>
						</GridItem>
						{state.allStats &&
							getSortedMovies().map((movie, index) => (
								<GridMovieRow key={index}>
									<GridItem className='col-start-1'>
										<p className='text-lg font-semibold'>
											{movie.movie.title}
										</p>
									</GridItem>
									<GridItem className='col-start-2'>
										<p>{movie.dayTotal.toFixed(2)} zł</p>
									</GridItem>
									<GridItem className='col-start-3'>
										<p>{movie.monthTotal.toFixed(2)} zł</p>
									</GridItem>
									<GridItem className='col-start-4'>
										<p>{movie.yearTotal.toFixed(2)} zł</p>
									</GridItem>
									<GridItem className='col-start-5'>
										<p>{movie.allTotal.toFixed(2)} zł</p>
									</GridItem>
								</GridMovieRow>
							))}
					</div>
				</div>
			</GrayContentWrapper>
		</StaticGradientBg>
	);
}
