import React from 'react';

type Props = {
	children?: React.ReactNode;
	styles?: string;
	id?: string;
};

export default function StaticGradientBg({ id, children, styles }: Props) {
	return (
		<div id={id} className={'background-all w-full h-screen ' + styles}>
			{children}
		</div>
	);
}
