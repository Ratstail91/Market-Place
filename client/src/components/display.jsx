import React from 'react';
import { useAppState } from '../context.jsx';

const Display = props => {
	const [state, dispatch] = useAppState();

	return (
		<p>{state.account.id}</p>
	);
};

export default Display;