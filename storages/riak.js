var Riak = require("basho-riak-client");

var single_node_manager = {
	executeOnNode : function(nodes, command, previous) {
		return nodes[0].execute(command);    
	}
}
 
var count = 0;
module.exports = function(max_key, callback) {
	var cluster = new Riak.Cluster.Builder()
		.withNodeManager(single_node_manager)
		.withExecutionAttmpts(1000)
		.withRiakNodes([new Riak.Node({ remoteAddress: "127.0.0.1", remotePort: "8087"}) ])
		.withQueueCommands(1e9)
		.build();
	var client = new Riak.Client(cluster);
	
	var r = {};
	r.read_one_random_record = function(next, old_key) {
		var key = old_key;
		if (typeof old_key == "undefined") {
			key = "key" + Math.floor((Math.random() * max_key) + 1);
		}
		client.fetchValue({ bucket: "storage_test", key: key }, function(err) {
			count++;
			if (err) {
				process.nextTick(function() { r.read_one_random_record(next, key); });
				return;
			}
			next();
		});
	};

	r.teardown = function() {
		client.shutdown(function() {});
	};
	
	client.ping(function (err) {
		callback(err, r);
	})
};