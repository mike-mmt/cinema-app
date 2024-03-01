import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ScreeningType, screeningSoundMap } from '../../utils/screeningsUtils';
import StaticGradientBg from '../StaticGradientBg';
import { MovieType } from '../repertoire/Repertoire';
import Seats from './Seats';

export interface PopulatedScreeningType extends Omit<ScreeningType, 'movieId'> {
	movieId: MovieType;
}

export default function Screening() {
	const { screeningId } = useParams();
	const [screening, setScreening] = useState<PopulatedScreeningType | null>(null);
	const [colsAmount, setColsAmount] = useState(16);

	useEffect(() => {
		axios.get(process.env.BACKEND_URL + '/screenings/' + screeningId).then((response) => {
			// console.log(response.data);
			if (response.status === 200) {
				setScreening(response.data);
				setColsAmount(calculateCols(response.data));
			}
		});
	}, [screeningId]);

	const calculateCols = (screening: ScreeningType) => Math.max(...screening.seats.map((seat) => seat.number));

	return (
		<StaticGradientBg id='main'>
			<div className='content-wrapper bg m-6 p-2 pb-12 bg-outer-space-half rounded-md flex flex-col min-h-screen'>
				{/* {JSON.stringify(screening)} */}

				{screening && (
					<>
						<div className='flex flex-col gap-2 border-b-2 border-magnolia m-6 pl-4'>
							<div className='flex text-xl mb-4 ml-8 items-center '>
								<h1 className='text-2xl font-semibold '>{screening.movieId.title}</h1>
								<p className='ml-8 pl-6 border-l-2 border-l-gray-400'>
									{new Date(screening.date)
										.toLocaleString()
										.replace(
											/(?<date>[\d.]+), (?<time>\d+:\d+):\d+(?<ampm> [apmAPM]+)?/,
											'$<time>$<ampm>  $<date>',
										)}
								</p>
								<p className='ml-8 pl-6 border-l-2 border-l-gray-400'>
									{screening.type + ' ' + screeningSoundMap[screening.sound]}
								</p>
							</div>
						</div>

						<Seats screening={screening} colsAmount={colsAmount} />
					</>
				)}
			</div>
		</StaticGradientBg>
	);
}
