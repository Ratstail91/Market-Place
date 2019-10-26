import React from 'react';
import ReactDOM from 'react-dom';

const App = props => {
	return (
		<p>Hello world</p>
	);
}

//start the process
ReactDOM.render(
	<App />,
	document.querySelector("#root")
);
