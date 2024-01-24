import GrayContentWrapper from './GrayContentWrapper';
import StaticGradientBg from './StaticGradientBg';
import { TbMovieOff } from 'react-icons/tb';

export default function NotFound() {
	return (
		<StaticGradientBg>
			<GrayContentWrapper>
				<div className='flex flex-col items-center gap-6 mt-8 text-3xl font-bold'>
					<p>Ups...</p>
					<TbMovieOff size={'1.75em'} />
					<p>Nie znaleziono strony</p>
				</div>
			</GrayContentWrapper>
		</StaticGradientBg>
	);
}
