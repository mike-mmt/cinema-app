import { useEffect } from 'react';
import GrayContentWrapper from '../GrayContentWrapper';
import StaticGradientBg from '../StaticGradientBg';
import axios from 'axios';

export default function Stats() {
	useEffect(() => {
		axios
			.get(import.meta.env.VITE_BACKEND_URL + '/orders/stats')
			.then((response) => {
				console.log(response.data);
			});
	});

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
	};

	return (
		<StaticGradientBg>
			<GrayContentWrapper></GrayContentWrapper>
		</StaticGradientBg>
	);
}
