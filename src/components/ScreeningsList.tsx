import { useContext } from 'react';
import { LoginContext } from '../contexts/LoginContext';
import { ScreeningType, screeningSoundMap } from '../utils/screeningsUtils';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../contexts/AdminContext';
import { MdDeleteForever } from 'react-icons/md';
import axios from 'axios';

type Props = {
	screenings: ScreeningType[] | undefined;
	setScreeningsHaveChanged?: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ScreeningsList({
	screenings,
	setScreeningsHaveChanged,
}: Props) {
	const loginContext = useContext(LoginContext);
	const adminContext = useContext(AdminContext);
	const navigate = useNavigate();

	const handleScreeningClick = (
		event: React.MouseEvent,
		screeningId: string,
	) => {
		event.stopPropagation();
		if (loginContext?.loggedIn) {
			navigate(`/screening/${screeningId}`);
		}
	};

	async function handleDelete(event: React.MouseEvent, id: string) {
		event.stopPropagation();
		const response = await axios.delete(
			import.meta.env.VITE_BACKEND_URL + '/screenings/' + id,
		);

		setScreeningsHaveChanged && setScreeningsHaveChanged(true);

		console.log(response);
	}

	return (
		<div className='screenings-wrapper flex flex-wrap gap-3 py-1 px-1'>
			{screenings?.map((screening, index) => {
				const date = new Date(screening.date);
				return (
					<div
						key={index}
						onClick={(e) => handleScreeningClick(e, screening._id)}
						className='relative cursor-pointer bg-outer-space-quarter border border-magnolia hover:border-rosered hover:text-rosered hover:bg-transparent transition-colors duration-100 py-2 min-h-12 min-w-24 rounded-md text-lg text-center tracking-wider'
					>
						<p className='text-xl'>
							{date.getHours().toString().padStart(2, '0') +
								':' +
								date.getMinutes().toString().padStart(2, '0')}
						</p>
						<p className='text-xs'>{`${screening.type}, ${
							screeningSoundMap[screening.sound]
						}`}</p>
						{adminContext?.isAdmin && setScreeningsHaveChanged && (
							<MdDeleteForever
								color='red'
								size='1em'
								className='absolute top-0 right-0 m-1 hover:bg-outer-space-half rounded-xl'
								onClick={(e) => handleDelete(e, screening._id)}
							/>
						)}
					</div>
				);
			})}
		</div>
	);
}
