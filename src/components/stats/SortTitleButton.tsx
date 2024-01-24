import React from 'react';
import { BiSolidDownArrow, BiSolidUpArrow } from 'react-icons/bi';
import { SortBy, StatsState, ActionType, SortOrder } from './StatsTypes';

type Props = {
	children: React.ReactNode;
	className?: string;
	sortBy: SortBy;
	state: StatsState;
	dispatch: React.Dispatch<ActionType>;
};

export default function SortTitleButton({ children, className, sortBy, state, dispatch }: Props) {
	return (
		<div
			onClick={() =>
				dispatch({
					type: 'SET_SORT_BY',
					sortBy: sortBy,
				})
			}
			className={'w-full h-full flex items-center justify-center gap-2 ' + className}
		>
			<p>{children}</p>
			{(state.sortBy === sortBy && state.sortOrder === SortOrder.ASC && (
				<BiSolidUpArrow className={state.sortBy === sortBy ? 'text-rosered' : 'text-magnolia'} />
			)) || <BiSolidDownArrow className={state.sortBy === sortBy ? 'text-rosered' : 'text-magnolia'} />}
		</div>
	);
}
