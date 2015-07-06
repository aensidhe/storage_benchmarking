var hs = require('node-handlersocket');

var handler_socket = function(max_key, ready) {
	var index = null;
	var connection = hs.connect(function()
	{
		connection.openIndex("db_name", "table_name", "PRIMARY", ["id", "str"], function (err, ind)
		{
			index = ind;
			ready();
		});
	});
	
	this.read_one_random_record = function(next) {
		var key = Math.floor((Math.random() * max_key) + 1);
		index.find('=', [key], function() { next(); });
	};
	
	this.teardown = function() {
		connection.disconnect();
	};
};

module.exports = handler_socket;