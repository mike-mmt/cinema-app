import React from 'react';

type Props = {
	children?: React.ReactNode;
};

export default function GrayContentWrapper({ children }: Props) {
	return (
		<div className='content-wrapper bg m-6 p-2 pb-12 bg-outer-space-half rounded-md flex flex-col'>
			{children}
		</div>
	);
}
