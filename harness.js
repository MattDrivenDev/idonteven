var http = require('http');
var port = process.env.PORT || 1337;

var responseHandler = function(response) {
	console.log("STATUS: " + response.statusCode);
	console.log("HEADERS: " + JSON.stringify(response.headers));

	var body = "";

	response.setEncoding("utf8");
	response.on("data", function(chunk) {
		body += chunk;
	});
	response.on("end", function() {
		console.log("DATA: " + JSON.stringify(body));
	});
};

var request = http.request({
	hostname: "localhost",
	port: port,
	method: "POST"
}, responseHandler);

var test1 = {
	first: "Matt",
	last: "Ball"
};

request.write(JSON.stringify(test1));
request.end();