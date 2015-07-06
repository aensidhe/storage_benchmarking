var Redis = require("ioredis")

Redis.Promise.onPossiblyUnhandledRejection(function (error) {
	// you can log the error here.
	// error.command.name is the command name, here is 'set'
	// error.command.args is the command arguments, here is ['foo']
	console.log(error);
});

var redis_storage = function(max_key, ready) {
	var redis = new Redis({
		connectTimeout: 10
	});
	
	this.read_one_random_record = function(next) {
		var key = Math.floor((Math.random() * max_key) + 1);
		redis.get(key, function() { next(); });
	};
	
	this.teardown = function() {
		redis.disconnect();
	};
	
	process.nextTick(function () { ready(); });
};

module.exports = redis_storage;