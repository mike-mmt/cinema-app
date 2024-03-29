import { useContext, useState } from 'react';
import { SeatType } from '../../utils/screeningsUtils';
import { PopulatedScreeningType } from './Screening';
import Seat from './Seat';
import { PricesContext } from '../../contexts/PricesContext';
import { useNavigate } from 'react-router-dom';
import { seatColors } from '../../utils/seatColors';
import { gridColsStyles, seatColumnStyles, seatRowsStyles } from './SeatStyles';

type Props = {
	screening: PopulatedScreeningType;
	colsAmount: number;
};

export default function Seats({ screening, colsAmount }: Props) {
	const prices = useContext(PricesContext);
	const [selectedSeats, setSelectedSeats] = useState<SeatType[]>([]);
	const navigate = useNavigate();

	const handleSelectSeat = (e: React.MouseEvent, seat: SeatType) => {
		e.stopPropagation();
		if (seat.taken) {
			return;
		} else if (selectedSeats.includes(seat)) {
			setSelectedSeats(selectedSeats.filter((s) => s !== seat));
		} else {
			setSelectedSeats([...selectedSeats, seat]);
		}
	};

	const getSeatColumnStyle = (seat: SeatType): string => {
		return seatColumnStyles[seat.number + 1];
	};
	const getSeatRowStyle = (seat: SeatType): string => {
		return seatRowsStyles[seat.row.toLowerCase()];
	};

	const getSeatColor = (seat: SeatType) => {
		if (seat.taken) {
			return seatColors.taken;
		} else if (selectedSeats.includes(seat)) {
			return `${seatColors.selected} ${seatColors.selectedhover}`;
		}
		return seat.class.toLowerCase() === 'vip'
			? `${seatColors.vip} ${seatColors.viphover}`
			: `${seatColors.normal} ${seatColors.normalhover}`;
	};

	const calculateOrderSum = () => {
		let sum = 0;
		selectedSeats.forEach((seat) => {
			sum += seat.class.toLowerCase() === 'vip' ? prices?.current?.vip ?? 0 : prices?.current?.normal ?? 0;
		});
		return sum;
	};

	const gridColsStyle = gridColsStyles[colsAmount + 1];

	return (
		<div className='seatsDiagram flex flex-col items-center'>
			<p className='w-4/5 border-zinc-800 text-zinc-400 border-b-4 font-normal text-center text-sm'>EKRAN</p>
			<div className={'seats p-8 grid grid-cols-17 gap-[0.25rem] ' + gridColsStyle}>
				{screening.seats.map(
					(seat, index) =>
						seat.number === 1 && (
							<p key={index} className={`col-start-1 ${getSeatRowStyle(seat)}`}>
								{seat.row}
							</p>
						),
				)}
				{screening.seats.map((seat, index) => (
					<Seat
						key={index}
						seatColor={getSeatColor(seat)}
						className={`${getSeatColumnStyle(seat)} ${getSeatRowStyle(seat)}`}
						onClick={(e) => handleSelectSeat(e, seat)}
					/>
				))}
			</div>
			<div className='legend flex gap-2 items-center'>
				{/* <div
					className={`bg- text-xs duration-75 text-black col-span-1 row-span-1 rounded-md w-7 h-7 ${seatColors.normal}`}
				></div> */}
				<Seat seatColor={seatColors.normal} />
				<p className='mr-2'>Normalny - {prices?.current?.normal} zł</p>
				<Seat seatColor={seatColors.vip} />
				<p className='mr-2'>VIP - {prices?.current?.vip} zł</p>
				<Seat seatColor={seatColors.taken} />
				<p className='mr-2'>Zajęty</p>
			</div>

			<div className='flex w-11/12 justify-between items-center mt-4'>
				<button
					className='bg-outer-space text-magnolia min-h-10 min-w-32 rounded flex justify-center items-center align-middle duration-150 active:bg-transparent active:border-2 active:border-magnolia'
					onClick={() => navigate(-1)}
				>
					Anuluj
				</button>
				{selectedSeats.length !== 0 && (
					<div className='selected flex gap-2 items-center'>
						<p>Wybrane fotele: </p>
						{selectedSeats.map((seat, index) => (
							<Seat
								key={index}
								seatColor={seat.class.toLowerCase() === 'vip' ? seatColors.vip : seatColors.normal}
								className='flex justify-center items-center w-10 h-10 text-gunmetal text-lg font-semibold text-center align-middle'
							>
								{seat.row + ' ' + seat.number}
							</Seat>
						))}
						<p>Suma: {calculateOrderSum().toFixed(2)} zł</p>
					</div>
				)}
				<button
					className='bg-rosered text-magnolia min-h-10 min-w-32 rounded flex justify-center items-center align-middle duration-150 active:bg-transparent active:border-2 active:border-magnolia'
					onClick={() =>
						navigate('/ordersummary', {
							state: {
								screening: screening,
								selectedSeats: selectedSeats,
							},
						})
					}
				>
					Dalej
				</button>
			</div>
		</div>
	);
}
