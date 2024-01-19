import { useEffect, useReducer, useState } from 'react';
import GrayContentWrapper from '../GrayContentWrapper';
import StaticGradientBg from '../StaticGradientBg';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface StatsState {
	allStats: {
		total: number;
		movies: MovieStats[];
	};
	dayStats: {
		total: number;
		movies: MovieStats[];
	};
	monthStats: {
		total: number;
	};
}
interface MovieStats {
	total: number;
	movieId: string;
	screenings: {
		screeningId: string;
		total: number;
	}[];
}

const reducer = (state: StatsState, action: any) => {
	switch (action.type) {
		case 'SET_TOTAL':
			return { ...state, total: action.payload };
		case 'SET_DAY_STATS':
			return { ...state, dayStats: action.payload };
		case 'SET_MONTH_STATS':
			return { ...state, monthStats: action.payload };
		default:
			return state;
	}
};

export default function Stats() {
	const [state, dispatch] = useReducer(reducer, {} as StatsState);
	const [day, setDay] = useState(new Date());

	useEffect(() => {
		axios
			.get(import.meta.env.VITE_BACKEND_URL + '/orders/stats')
			.then((response) => {
				console.log('total');

				console.log(response.data);

				dispatch({
					type: 'SET_TOTAL',
					payload: response.data[0].total,
				});
			});

		fetchDayStats(day);
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
		console.log('day');

		console.log(response.data);

		dispatch({ type: 'SET_DAY_STATS', payload: response.data[0] });
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
		dispatch({ type: 'SET_MONTH_STATS', payload: response.data[0] });
	};

	return (
		<StaticGradientBg>
			<GrayContentWrapper>
				<div className='flex flex-col items-start p-8 pt-3'>
					<h1 className='font-semibold text-2xl w-full border-b-2 border-b-magnolia p-2'>
						Statystyki sprzedaży
					</h1>
					<div className='flex gap-2 text-lg p-4'>
						<p>Całkowity przychód: </p>
						<p className='font-semibold'>
							{state.allStats && state.allStats.total.toFixed(2)}{' '}
							zł
						</p>
					</div>

					<div className='flex flex-col items-center'>
						<DatePicker
							selected={day}
							onChange={(date: Date) => {
								setDay(date);
								fetchDayStats(date);
							}}
							className='cursor-pointer bg-transparent py-2 border-b-2 border-magnolia text-center text-xl font-semibold focus:outline focus:outline-magnolia'
							dateFormat='dd.MM'
						/>
						<div className='flex gap-2 text-lg p-4'>
							<p>Przychód dnia {day.toLocaleDateString()}:</p>
							<p className='font-semibold'>
								{state.dayStats &&
									state.dayStats.total.toFixed(2)}{' '}
								zł
							</p>
						</div>
						<div>
							{state.dayStats?.movies.map(() => {
								<p>a</p>;
							})}
						</div>
					</div>
				</div>
			</GrayContentWrapper>
		</StaticGradientBg>
	);
}
