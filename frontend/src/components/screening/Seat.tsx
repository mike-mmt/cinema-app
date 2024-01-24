import { ReactNode } from 'react';

type Props = {
	children?: ReactNode;
	seatColor: string;
	className?: string;
	onClick?: (e: React.MouseEvent) => void;
};

export default function Seat({ children, seatColor, className, onClick }: Props) {
	return (
		<div
			className={
				`bg- text-xs duration-75 text-black col-span-1 row-span-1 rounded-md w-7 h-7 ` +
				seatColor +
				' ' +
				className
			}
			onClick={onClick}
		>
			{children}
		</div>
	);
}
