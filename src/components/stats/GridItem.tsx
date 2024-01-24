import React from 'react';

type Props = {
	children: React.ReactNode;
	className?: string;
};

export default function GridItem({ children, className }: Props) {
	return (
		<div
			className={
				'border border-magnolia w-full h-full flex justify-center items-center col-span-1 row-span-1 *:p-2 ' +
				className
			}
		>
			{children}
		</div>
	);
}
