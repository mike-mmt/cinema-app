import React, { createContext } from 'react';

export interface PricesType {
	[key: string]: number;
}

export const PricesContext = createContext<React.MutableRefObject<PricesType | undefined> | undefined>(undefined);
