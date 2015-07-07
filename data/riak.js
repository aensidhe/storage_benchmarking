var Riak = require("basho-riak-client");
var util = require("./util.js");
var client = new Riak.Client(["127.0.0.1:8087"]);
var semaphore = require("semaphore")(100);

client.ping(function(err) {
    if (err) {
        util.done(err);
    }
    var count = 0;
    for (var i = 0; i < 10000; i++) {
        semaphore.take(function () {
            client.storeValue({ bucket: "storage_test", key: "key" + i, value: util.random_string(1024) }, function(err){
                if (err)
                {
                    throw "Error at i = " + i + err;
                }
                
                if (++count >= util.max_record_count) {
                    client.shutdown(function (state) {
                        if (state === Riak.Cluster.State.SHUTDOWN) {
                            process.exit();
                        }
                    });
                }
                
                if (count % 1000 == 0) {
                    console.log("Inserted " + count + " records");
                }
                semaphore.leave();
            });
        });
    }
});