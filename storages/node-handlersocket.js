var handlersocket = require("node-handlersocket");

var init_hs = function(max_key, callback) {
	var connection = handlersocket.connect(function()
	{
		connection.openIndex("hs_test", "test_table", "PRIMARY", ["id", "str"], function (err, ind)
		{	
			var hs = {};		
			hs.read_one_random_record = function(next) {
				var key = Math.floor((Math.random() * max_key) + 1);
				ind.find('=', [key], function() { next(); });
			};
			
			hs.teardown = function() {
				connection.close();
			};
			
			callback(err, hs);
		});
	});
};

module.exports = function(max_key, callback) { 
	init_hs(max_key, callback);
};