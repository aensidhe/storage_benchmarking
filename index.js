#! /usr/bin/env node

var RedisStorage = require("./redis_storage.js");
// var process = require("process");
var async = require("async");

function format_ms(hrtime) {
	return (hrtime[0] * 1e9 + hrtime[1]) / 1e6;
}

function simple_test(storage_creator, num_count, record_count) {
	var start = process.hrtime();
	console.log("Test started");
	
	var storage = new storage_creator(record_count);
	console.log("Storage created in %d ms", format_ms(process.hrtime(start)));
	
	start = process.hrtime();
	async.times(
		num_count,
		function(n, next) {
			storage.read_one_random_record(next);
		},
		function(err) {
			var stop = process.hrtime(start);
			console.log("Test finished: %d ops, %d ms, %d ops/sec", num_count, format_ms(stop), num_count * 1000 / format_ms(stop));
			
			storage.teardown();
		}
	);
}

simple_test(RedisStorage, 5e5, 1e6);