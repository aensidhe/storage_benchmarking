#! /usr/bin/env node

var redis = require("redis").createClient();
var async = require("async");
var util = require("./util.js");

var i = 0;

function add_record() {
	redis.set("key" + i, util.random_string(1024), function(err) {
		if (err || i++ >= util.max_record_count) {
			util.done(err);
			return;
		}
		
		if (i % 1e3 == 0) {
			console.log("Inserted " + i + " records");
		}
		
		add_record();
	});
}
 
redis.on('error', function(err) {
	console.log('error', err);
});

redis.send_command("FLUSHDB", [], function(err) {
	add_record();
});