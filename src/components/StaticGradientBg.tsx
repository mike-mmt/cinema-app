import React from 'react';

type Props = {
	children?: React.ReactNode;
	styles?: string;
};

export default function StaticGradientBg({ children, styles }: Props) {
	return (
		<div className={'background-all w-full h-screen ' + styles}>
			{children}
		</div>
	);
}
