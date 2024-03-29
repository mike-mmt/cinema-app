// type Props = {};

import StaticGradientBg from '../StaticGradientBg';
import LoginForm from './LoginForm';

export default function Login() {
	return (
		<StaticGradientBg>
			<div className='main-page-content content-wrapper m-6 p-8 pb-12 bg-outer-space-half rounded-md flex flex-col items-center'>
				<h1 className='font-redhat text-3xl ml-10'>Zaloguj się do OmniKina</h1>
				<LoginForm />
			</div>
		</StaticGradientBg>
	);
}
