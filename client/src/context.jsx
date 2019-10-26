import React, { useContext, useReducer } from 'react';

export const AppContext = React.createContext();

export const AppProvider = ({ reducer, initialState, children }) => {
	return (
		<AppContext.Provider value={useReducer(reducer, initialState)}>
			{children}
		</AppContext.Provider>
	);
}

export const useAppState = () => useContext(AppContext);
