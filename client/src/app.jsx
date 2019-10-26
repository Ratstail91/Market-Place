import React from 'react';

import Display from './components/display.jsx';
import Button from './components/button.jsx';

const App = props => {
	return (
		<div>
			<p>Hello world</p>
			<Display />
			<Button />
		</div>
	);
}

export default App;