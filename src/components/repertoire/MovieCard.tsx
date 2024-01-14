import { MovieType } from './Repertoire';
import { useNavigate } from 'react-router';
import ScreeningsList from '../ScreeningsList';

type Props = { movie: MovieType };

export default function MovieCard({ movie }: Props) {
	const navigate = useNavigate();

	const handleCardClick = () => {
		navigate(`/movie/${movie._id}`);
	};

	return (
		<div
			className='grid-item flex items-center bg-outer-space-quarter hover:bg-outer-space-8th transition-colors duration-200 rounded-md p-2'
			onClick={handleCardClick}
		>
			<img src={movie.photoUrl} className='m-4 w-4/12'></img>
			<div className='info flex flex-col w-full'>
				<div className='title-genres-wrapper border-b-2 pb-4 border-b-outer-space-quarter'>
					<h2 className='break-normal text-xl font-semibold text-center '>
						{movie.title}
					</h2>
				</div>
				<div className='flex items-center mt-4 gap-2'>
					<ScreeningsList screenings={movie.screenings} />
				</div>
			</div>
		</div>
	);
}
