#! /usr/bin/env node

var RedisStorage = require("./storages/redis.js");
var IORedisStorage = require("./storages/ioredis.js");
var NodeHandlerSocket = require("./storages/node-handlersocket.js");
var ManualHandlerSocket = require("./storages/hs-manual.js");
var Riak = require("./storages/riak.js");
var TarantoolStorage = require("./storages/tarantool.js")
var async = require("async");

function format_ms(hrtime) {
	return (hrtime[0] * 1e9 + hrtime[1]) / 1e6;
}

function test_storage(options) {
	if (options.index >= options.iteration_count)
	{
		var stop = process.hrtime(options.start);
		console.log("Test finished: %d ops, %d ms, %d ops/sec",
			options.iteration_count, 
			format_ms(stop), 
			options.iteration_count * 1000 / format_ms(stop));
			
		options.storage.teardown();
		console.log();
		options.done();
		return;
	}
	
	options.index++;
	options.storage.read_one_random_record(function() { test_storage(options); });
}

function simple_test(name, storage_creator, num_count, record_count, next) {
	var start = process.hrtime();
	console.log("Test '" + name + "' started");
	
	storage_creator(record_count, function (err, storage) { 
		console.log("Storage created in %d ms", format_ms(process.hrtime(start)));
		if (err)
		{
			console.log(err);
			return;
		}	
		test_storage({ storage: storage, iteration_count: num_count, done: next, start: process.hrtime(), index: 0 });
	});
};

var num = 5e5;
var record_num = 1e6;

var runner = async.seq(
	function (callback) { simple_test("redis", RedisStorage, num, record_num, callback); },
	function (callback) { simple_test("ioredis", IORedisStorage, num, record_num, callback); },
	function (callback) { simple_test("node-handlersocket", NodeHandlerSocket, num, record_num, callback); },
	function (callback) { simple_test("manual-hs", ManualHandlerSocket, num, record_num, callback); },
	//function (callback) { simple_test("riak", Riak, num, record_num, callback); }
	function (callback) { simple_test("tarantool", TarantoolStorage, num, record_num, callback); }
);

runner(function(err) { 
	if (err) {
		console.error(err);
	}
	console.log("Done");
	process.exit();
})