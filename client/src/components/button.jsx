import React from 'react';
import { useAppState } from '../context.jsx';

import { login } from '../actions/account_actions.js';

const Button = props => {
	const [state, dispatch] = useAppState();

	return (
		<button onClick={() => dispatch(login( state.account.id + 1 )) }>Click Me!</button>
	);
};

export default Button;