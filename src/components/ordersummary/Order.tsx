import { useLocation } from 'react-router-dom';
import GrayContentWrapper from '../GrayContentWrapper';
import StaticGradientBg from '../StaticGradientBg';

export default function Order() {
	const { state } = useLocation();
	return (
		<StaticGradientBg>
			<GrayContentWrapper>
				<div className='flex flex-col items-center gap-6 mt-8'>
					<p>Numer twojego zamówienia: {state.orderId}</p>
					<p>Bilety zostały wysłane na twój adres e-mail</p>
				</div>
			</GrayContentWrapper>
		</StaticGradientBg>
	);
}
