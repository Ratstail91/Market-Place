import React from 'react';
import ReactDOM from 'react-dom';

import { AppProvider } from './context.jsx';
import reducers from './reducers/reducers.js';

import App from './app.jsx';

//start the process
ReactDOM.render(
	<AppProvider initialState={ reducers({}, {type: null}) } reducer={reducers}>
		<App />
	</AppProvider>,
	document.querySelector("#root")
);
