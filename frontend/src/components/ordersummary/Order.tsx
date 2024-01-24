import { useLocation } from 'react-router-dom';
import GrayContentWrapper from '../GrayContentWrapper';
import StaticGradientBg from '../StaticGradientBg';
import LinkButton from '../LinkButton';

export default function Order() {
	const { state } = useLocation();
	return (
		<StaticGradientBg>
			<GrayContentWrapper>
				<div className='flex flex-col items-center gap-6 mt-8'>
					<p>Numer twojego zamówienia: {state.orderId}</p>
					<p>Bilety zostały wysłane na twój adres e-mail</p>
					<LinkButton
						link='/repertoire'
						text='Repertuar'
						styles='min-h-16 min-w-48 text-xl bg-outer-space-half hover:bg-outer-space-quarter transition-colors duration-100'
					/>
				</div>
			</GrayContentWrapper>
		</StaticGradientBg>
	);
}
