var payments = crossfilter([
						{date: "2011-11-14T16:17:54Z", quantity: 2, total: 190, tip: 100, type: "tab"},
						{date: "2011-11-14T16:20:19Z", quantity: 2, total: 190, tip: 100, type: "tab"},
						{date: "2011-11-14T16:28:54Z", quantity: 1, total: 300, tip: 200, type: "visa"},
						{date: "2011-11-14T16:30:43Z", quantity: 2, total: 90, tip: 0, type: "tab"},
						{date: "2011-11-14T16:48:46Z", quantity: 2, total: 90, tip: 0, type: "tab"},
						{date: "2011-11-14T16:53:41Z", quantity: 2, total: 90, tip: 0, type: "tab"},
						{date: "2011-11-14T16:54:06Z", quantity: 1, total: 100, tip: 0, type: "cash"},
						{date: "2011-11-14T16:58:03Z", quantity: 2, total: 90, tip: 0, type: "tab"},
						{date: "2011-11-14T17:07:21Z", quantity: 2, total: 90, tip: 0, type: "tab"},
						{date: "2011-11-14T17:22:59Z", quantity: 2, total: 90, tip: 0, type: "tab"},
						{date: "2011-11-14T17:25:45Z", quantity: 2, total: 200, tip: 0, type: "cash"},
						{date: "2011-11-14T17:29:52Z", quantity: 1, total: 200, tip: 100, type: "visa"}
						]);
console.log('--payments--');
console.log('number of payments: '+payments.size());

console.log('--dimension total--');
var paymentsByTotal = payments.dimension(function(d) { return d.total; });
console.log(paymentsByTotal);

console.log('--filter--');
console.log(paymentsByTotal.filter([100, 200]).top(Infinity)); // selects payments whose total is between 100 and 200
console.log(paymentsByTotal.filter([100, 200]).bottom(Infinity)); // selects payments whose total is between 100 and 200
console.log(paymentsByTotal.filter(90).top(Infinity)); // selects payments whose total equals 120
console.log(paymentsByTotal.filter(function(d) {return d % 2; }).top(Infinity)); // selects payments whose total is odd
console.log(paymentsByTotal.filter(null).top(Infinity)); // selects all payments

console.log('--group total--');
var paymentGroupsByTotal = paymentsByTotal.group(function(total) { 
	var div = Math.ceil(total / 100);
	return div;
});
console.log(paymentGroupsByTotal.top(Infinity));

console.log('--dimension type group by total--');
var paymentsByType = payments.dimension(function(d) { return d.type; }),
paymentVolumeByType = paymentsByType.group().reduceSum(function(d) { return d.total; }),
topTypes = paymentVolumeByType.top(1);
console.log(topTypes[0].key); // the top payment type (e.g., "tab")
console.log(topTypes[0].value); // the payment volume for that type (e.g., 900)

function reduceAdd(p, v) {
	console.log(p,v);
		++p.count;
  	p.total += v.total;
  	return p;
}

function reduceRemove(p, v) {
		--p.count;
  	p.total -= v.total;
  	return p;
}

function reduceInitial() {
		return {count: 0, total: 0};
}

function orderValue(p) {
		return p.total;
}

console.log('--group by total and order--');
var topTotals = paymentVolumeByType.reduce(reduceAdd, reduceRemove, reduceInitial).order(orderValue).top(2);
console.log(topTotals[0].key);
console.log(topTotals[0].value);

console.log('--group by type and show by count--');
var paymentsByType = payments.dimension(function(d) { return d.type; });
paymentCountByType = paymentsByType.group();
topTypes = paymentCountByType.top(1);
topTypes[0].key; // the top payment type (e.g., "tab")
topTypes[0].value; // the count of payments of that type (e.g., 8)

console.log('--all groups--');
var types = paymentCountByType.all();
console.log(types);