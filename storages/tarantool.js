var TarantoolConnection = require("tarantool-driver");

var init_tarantool = function(max_key, callback) {
	var client = new TarantoolConnection({port:3301});

 	client.connect()
	 .then(function(){
		var tarantool = {};		
		tarantool.read_one_random_record = function(next) {
			var key = [Math.floor((Math.random() * max_key) + 1)];

			client
			.select('performance', 'primary', 1, 0, 'eq', key)
			.then(function (res){
				next();
			},
			function (err){
				console.log("error " + err);
			});
		};
			
		tarantool.teardown = function() {
			client.destroy(true);
		};
			
		callback(null,tarantool);
		});
};
 
module.exports = function(max_key, callback) { 
	init_tarantool(max_key, callback);
};