import { useLocation, useNavigate } from 'react-router-dom';
import GrayContentWrapper from '../GrayContentWrapper';
import StaticGradientBg from '../StaticGradientBg';
import { SeatType, screeningSoundMap } from '../../utils/screeningsUtils';
import Seat from '../screening/Seat';
import { seatColors } from '../../utils/seatColors';
import { useContext } from 'react';
import { PricesContext } from '../../contexts/PricesContext';
import LinkButton from '../LinkButton';
import axios from 'axios';

export default function OrderSummary() {
	const prices = useContext(PricesContext);
	const navigate = useNavigate();

	const { state } = useLocation();
	const { screening, selectedSeats } = state;

	const calculateOrderSum = () => {
		let sum = 0;
		selectedSeats.forEach((seat: SeatType) => {
			sum += seat.class.toLowerCase() === 'vip' ? prices?.current?.vip ?? 0 : prices?.current?.normal ?? 0;
		});
		return sum;
	};

	const payForOrder = async () => {
		// payment logic would be here
		const response = await axios.post(process.env.BACKEND_URL + '/orders', {
			screeningId: screening._id,
			seats: selectedSeats,
		});
		console.log(response);
		navigate('/order', { state: { orderId: response.data._id } });
	};

	return (
		<StaticGradientBg>
			<GrayContentWrapper>
				<div className='flex flex-col items-center gap-4 mt-8'>
					{screening && (
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
					)}
					<div className='selected flex flex-col gap-6 items-center'>
						<div className='flex gap-2 items-center'>
							<p>Wybrane fotele: </p>
							{selectedSeats.map((seat: SeatType, index: number) => (
								<Seat
									key={index}
									seatColor={seat.class.toLowerCase() === 'vip' ? seatColors.vip : seatColors.normal}
									className='flex justify-center items-center w-10 h-10 text-gunmetal text-lg font-semibold text-center align-middle'
								>
									{seat.row + ' ' + seat.number}
								</Seat>
							))}
						</div>

						<p className='ml-6 text-lg'>Suma: {calculateOrderSum().toFixed(2)} zł</p>
					</div>
					<div className='flex gap-12 justify-around'>
						<LinkButton link={`/screening/${screening._id}`} text='Anuluj' />
						<button
							className='bg-rosered text-magnolia min-h-10 min-w-32 rounded flex justify-center items-center align-middle duration-150 active:bg-transparent active:border-2 active:border-magnolia'
							onClick={payForOrder}
						>
							Zapłać
						</button>
					</div>
				</div>
			</GrayContentWrapper>
		</StaticGradientBg>
	);
}
