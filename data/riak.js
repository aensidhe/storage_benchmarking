var Riak = require("basho-riak-client");
var util = require("./util.js");
var client = new Riak.Client(["127.0.0.1:8087"]);
var semaphore = require("semaphore")(10);

client.ping(function(err) {
    if (err) {
        util.done(err);
        return;
    }
    var count = 0;
    var max_count = 1000;
    for (var i = 0; i < max_count; i++) {
        semaphore.take(function () {
            var riakObj = new Riak.Commands.KV.RiakObject();
            riakObj.setContentType("text/plain");
            riakObj.setValue(util.random_string(1024));
            var options = { bucket: "storage_test", key: "key" + i, value: riakObj };            
            client.storeValue(options, function(err, rslt){
                semaphore.leave();                
                if (err)
                {
                    throw "Error at i = " + i + err;
                }
                
                if (++count >= max_count) {
                    client.shutdown(function (state) {
                        if (state === Riak.Cluster.State.SHUTDOWN) {
                            process.exit();
                        }
                    });
                }
                
                if (count % 10 == 0) {
                    console.log("Inserted " + count + " records. " + JSON.stringify(rslt));
                }
            });
        });
    }
});