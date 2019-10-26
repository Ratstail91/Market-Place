import accountReducer from './account_reducer.js';

export default ({ account }, action) => ({
	account: accountReducer(account, action),
});