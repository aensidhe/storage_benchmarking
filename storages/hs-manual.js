var net = require("net");
var through = require("through2");
var split = require("split");

module.exports = function(max_key, callback) {
	var socket = net.connect(9998, function (err) {
		if (err)
		{
			callback(err, hs);
			return;
		}
		
		var hs = {};
		var read_callback;
		hs.read_one_random_record = function(next) {
			var key = Math.floor((Math.random() * max_key) + 1);
			read_callback = next;
			socket.write("0\t=\t1\t" + key + "\n");
		};
		
		hs.teardown = function() {
			socket.end();
		};
		
		socket.setEncoding("utf8");
		var state = 0;
		
		socket.pipe(split()).pipe(through(function (buf, _, next) {
		    var line = buf.toString();
			var err = null;
			if (line.split("\t")[0] != "0")
			{
				err = "ALARM! ERROR!" + line;
			}
			
		    switch (state) {
				case 0:
					throw "Read data in disconnected mode";
				case 1:
					state = 2;
					callback(err, hs);
					break;
				case 2:
					read_callback(err, line);
					break;
				default:
					throw "Unknown state: " + state;				
			}
		    next();
		}))
		
		socket.write("P\t0\ths_test\ttest_table\tPRIMARY\tstr\n", function (err) {
			state = 1;
		});
	});
};
/*
module.exports(1e6, function(err, hs) 
{ 
	if (err)
	{
		console.log("Error connection: " + err);
		process.exit();
	}
	hs.read_one_random_record(function (err, line) {
		if (err)
		{
			console.log("Error reading: " + err);
		}
		else
		{
			hs.teardown();
			console.log("Done! " + line);
		}
		process.exit();
	});
})*/