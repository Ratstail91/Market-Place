import { LOGIN, LOGOUT, SESSION_CHANGE } from '../actions/account_actions.js';

const initialState = {
	id: 0,
	email: '',
	username: '',
	token: '',
};

export default (state = initialState, action) => {
	switch(action.type) {
		case LOGIN: {
			let newState = JSON.parse(JSON.stringify(initialState));

			newState.id = action.id;
			newState.email = action.email;
			newState.username = action.username;
			newState.token = action.token;

			return newState;
		}

		case LOGOUT:
			return initialState;

		case SESSION_CHANGE: {
			let newState = JSON.parse(JSON.stringify(state));

			newState.token = action.token;

			return newState;
		}

		default:
			return state;
	}
};