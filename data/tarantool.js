#! /usr/bin/env node

var TarantoolConnection = require("tarantool-driver");
var async = require("async");
var util = require("./util.js");

var connection = new TarantoolConnection({port:3301});
var i = 0;

function add_record() {
	var valueToInsert =  [i, util.random_string(1024)];
	
	connection.insert('performance', valueToInsert)
	.then(function(){
		if (i++ >= util.max_record_count) {
			util.done(null);
			return;
		}
		if (i % 1e3 == 0) {
			console.log("Inserted " + i + " records");
		}

		add_record();
	},
	function (err){
		util.done(err);
			return;
	});
}
 
connection.connect()
.then(function () {
	console.log("Connected");
	add_record()
});