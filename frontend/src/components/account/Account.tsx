import { useLayoutEffect, useState } from 'react';
import GrayContentWrapper from '../GrayContentWrapper';
import StaticGradientBg from '../StaticGradientBg';
import axios from 'axios';
import { SeatType } from '../../utils/screeningsUtils';
import Seat from '../screening/Seat';
import { seatColors } from '../../utils/seatColors';

interface Account {
	firstName: string;
	lastName: string;
	email: string;
	orders: Order[];
}

interface Order {
	_id: string;
	paid: boolean;
	price: number;
	seats: SeatType[];
	screeningId: {
		_id: string;
		date: string;
		sound: string;
		type: string;
		movieId: {
			title: string;
		};
	};
}

export default function Account() {
	const [account, setAccount] = useState({} as Account);

	useLayoutEffect(() => {
		axios.get(import.meta.env.VITE_BACKEND_URL + '/account').then((response) => {
			console.log(response.data);

			response.status === 200 && setAccount(response.data);
		});
	}, []);

	return (
		<StaticGradientBg>
			<GrayContentWrapper>
				<h2 className='ml-2 pl-10 mt-6 font-bold text-2xl border-b-2 border-rosered pb-4 w-1/5'>Konto</h2>
				{account && (
					<div className='flex flex-col m-2 mt-0 border-b-2 border-magnolia p-4'>
						<p>
							Imię i nazwisko: {account.firstName} {account.lastName}
						</p>
						<p>Email: {account.email}</p>
					</div>
				)}
				{account.orders && account.orders.length !== 0 && (
					<div className='grid grid-cols-2 grid-flow-row p-4'>
						{account.orders?.map((order) => (
							<div
								key={order._id}
								className='flex flex-col rounded-md border-2 border-magnolia p-4 m-4 gap-4'
							>
								<div className='flex gap-4 *:border-r-2 *:border-outer-space *:pr-4'>
									<p className='flex gap-2'>
										Numer zamówienia: <h3 className='font-semibold'>{order._id}</h3>
									</p>
									<p>{order.price.toFixed(2)} zł</p>
									<p>{order.paid ? 'Opłacone' : 'Nieopłacone'}</p>
								</div>
								<div className='flex gap-4 *:border-r-2 *:border-outer-space *:pr-4'>
									<p>{order.screeningId.movieId.title}</p>
									<p>{new Date(order.screeningId.date).toLocaleString()}</p>
									<div className='flex gap-2'>
										<p>Fotele: </p>
										{order.seats.map((seat, index) => (
											<Seat
												key={index}
												seatColor={
													seat.class.toLowerCase() === 'vip'
														? seatColors.vip
														: seatColors.normal
												}
												className='flex justify-center items-center text-center align-middle text-gunmetal font-semibold'
											>
												{seat.row}
												{seat.number}
											</Seat>
										))}
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</GrayContentWrapper>
		</StaticGradientBg>
	);
}
