#! /usr/bin/env node

var mysql = require("mysql");
var util = require("./util.js");
var async = require("async");

function repeat(part, sep, num) {
	var string_value = "";
	var separator = "";
	for (var i = 0; i < num; i++) {
		string_value += separator + part;
		separator = sep;
	}
	return string_value;
}

var connection = mysql.createConnection({
	host     : "localhost",
	user     : "root",
	database : "hs_test"
});

connection.connect();

connection.query("truncate table test_table", function(err, rows, fields) {
	if (err) throw err;
});

var string_value = "concat(" + repeat("md5(rand())", ", ", 32) + ")";
var query = "insert into test_table(str) values \n" + repeat("(" + string_value + ")", ",\n", util.record_per_iteration)

async.times(util.max_record_count / util.record_per_iteration,
	function (n, next) { 
		connection.query(query, function(err) {
			next(err);
			console.log("Inserted " + n + " batch");			
		});
	},
	function(err) {
		connection.end();
		util.done(err);
	});