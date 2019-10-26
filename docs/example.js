//the tickers of different businesses
const APPL = 'APPL'; //Applied Phlebotinum League
const MSFT = 'MSFT'; //Mattress Surfer's Team Association
const LNUX = 'LNUX'; //Let's Not Use Experts

const OK = 0;
const ERR_NOT_ENOUGH_MONEY = -1;
const ERR_NOT_ENOUGH_STOCK = -2;

const FIRE_CEO = 1;
const FIRE_STAFF = 2;

//ticks could be daily? Hourly?
function run(market, user, news) {
	if (market[APPL].value > 9.0) {
		user.buy(APPL, 1000);
	}

	if (user.stock[MSFT] >= 1000) {
		user.sell(MSFT, 1000);
	}

	console.log( user.money );

	market[LNUX].vote(FIRE_CEO, () => null, () => null); //vote(subject, onSuccess, onFailure)
}

module.exports = {
	run
};

/* DOCS:
 * All businesses start with 1000 stock. The more stock you have, the more control you have over the company for votes.
 * The user starts with 500 money.
 * "market" contains information about every business on the stock market:
 *     value - the value of the stock today
       history - the value of the stock over the last 30 days; history[0] is equal to value
 * "user" contains information about the user
 *     money - current money value, can change during the script
 *     stock - array containing the amount of stock owned from each company, or undefined if none
 * "news" carries information about what's happening in the world, procedurally generated.
 *     array containing the last 10 headlines (procedurally generated headlines about news in the "real world" that would effect stock)
*/