var Riak = require("basho-riak-client");
var util = require("./util.js");
var client = new Riak.Client(["127.0.0.1:8087"]);
var semaphore = require("semaphore")(10);

var count = 0;
var max_count = util.max_record_count;

function create_riak_object(i) {
    var riakObj = new Riak.Commands.KV.RiakObject();
    riakObj.setContentType("text/plain");
    riakObj.setValue(util.random_string(1024));
    return { bucket: "storage_test", key: "key" + i, value: riakObj };
}

function insert_value() {
    client.storeValue(create_riak_object(count), function(err, rslt) {
        if (err) {
            throw "Err at count = " + count + ", " + err;
        }
        
        if (++count >= max_count) {
            client.shutdown(function() { util.done(); });
            return;
        }
        
        if (count % util.record_per_iteration == 0) {
            console.log("Inserted " + count + ".");
        }
        
        insert_value();
    });
}

client.ping(function(err) {
    if (err) {
        util.done(err);
        return;
    }
});

insert_value();