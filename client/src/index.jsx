import React from 'react';
import ReactDOM from 'react-dom';

import { AppProvider } from './context.jsx';
import reducers from './reducers/reducers.js';

import App from './app.jsx';

//persistence between page reloads
const ITEM_NAME = 'state.marketplace';
let initialState = localStorage.getItem(ITEM_NAME);
initialState = initialState ? JSON.parse(initialState) : reducers({}, {type: null});

const onDispatch = (state, action) => {
	const ret = reducers(state, action);
	localStorage.setItem(ITEM_NAME, JSON.stringify(ret));
	return ret;
}

//start the process
ReactDOM.render(
	<AppProvider initialState={initialState} reducer={onDispatch}>
		<App />
	</AppProvider>,
	document.querySelector("#root")
);
