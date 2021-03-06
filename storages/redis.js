var redis = require("redis");

var redis_storage = function(max_key) {
	var client = redis.createClient();
 
	client.on('error', function(err) {
		console.log('error', err);
	});
	
	this.read_one_random_record = function(next) {
		var key = "key" + Math.floor((Math.random() * max_key) + 1);
		client.get(key, function(err){
			next();
		});
	};

	this.teardown = function() {
		client.end();
	};
};
 
module.exports = function(max_key, callback) { 
	var s = new redis_storage(max_key);
	callback(null, s);
};