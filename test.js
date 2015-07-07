#! /usr/bin/env node

var RedisStorage = require("./storages/redis.js");
var IORedisStorage = require("./storages/ioredis.js");
var NodeHandlerSocket = require("./storages/node-handlersocket.js")
var async = require("async");

function format_ms(hrtime) {
	return (hrtime[0] * 1e9 + hrtime[1]) / 1e6;
}

function test_storage(storage, num_count, next) {
	var start = process.hrtime();
	async.times(
		num_count,
		function(n, next) {
			storage.read_one_random_record(next);
		},
		function(err) {
			var stop = process.hrtime(start);
			console.log("Test finished: %d ops, %d ms, %d ops/sec", num_count, format_ms(stop), num_count * 1000 / format_ms(stop));
			
			storage.teardown();
			console.log();
			next();
		}
	);
}

function simple_test(name, storage_creator, num_count, record_count, next) {
	var start = process.hrtime();
	console.log("Test '" + name + "' started");
	
	var storage = storage_creator(record_count, function (err, s) { 
		console.log("Storage created in %d ms", format_ms(process.hrtime(start)));
		if (err)
		{
			console.log(err);
			return;
		}	
		test_storage(s, num_count, next);
	});
};

var num = 5e2;
var record_num = 1e6;

var runner = async.seq(
	function (callback) { simple_test("redis", RedisStorage, num, record_num, callback); },
	function (callback) { simple_test("ioredis", IORedisStorage, num, record_num, callback); },
	function (callback) { simple_test("node-handlersocket", NodeHandlerSocket, num, record_num, callback); }
);

runner(function(err) { 
	if (err) {
		console.error(err);
	}
	console.log("Done");
	process.exit();
})