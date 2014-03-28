var http = require('http');
var port = process.env.PORT || 1337;

var server = http.createServer(function(request, response) {
	var body = "";
	request.setEncoding("utf8");
	request.on("data", function(chunk) {
		body += chunk;
	});
	request.on("end", function() {
		try 
		{
			var data = JSON.parse(body);
			console.log(data);

			response.write(typeof data);
			response.end();
		}
		catch(error)
		{
			var msg = "error: " + error.message;
			
			console.log(msg);
			response.statusCode = "400";
			return response.end(msg);
		}
	});
});

server.listen(port);