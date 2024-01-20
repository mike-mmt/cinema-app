export enum SortBy {
	NAME = 'name', // name sorting direction is inverted
	DAY = 'day',
	MONTH = 'month',
	YEAR = 'year',
	ALL = 'all',
}
export enum SortOrder {
	ASC = 'asc',
	DESC = 'desc',
}
export interface StatsState {
	allStats: {
		total: number;
		movies: MovieStats[];
	};
	dayStats: {
		total: number;
		movies: MovieStats[];
	};
	monthStats: {
		total: number;
		movies: MovieStats[];
	};
	yearStats: {
		total: number;
		movies: MovieStats[];
	};
	sortBy: SortBy;
	sortOrder: SortOrder;
}
export interface MovieStats {
	totalPerMovie: number;
	movie: {
		_id: string;
		title: string;
	};
	screenings: {
		screeningId: string;
		total: number;
	}[];
}
export interface ActionType {
	type: string;
	payload?: {
		total: number;
		movies: MovieStats[];
	};
	sortBy?: SortBy;
}
