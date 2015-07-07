### Servers launch

- mysql.server start (/etc/my.cnf)
- redis-server redis.conf

### Assumptions

Redis will run without background saves, it listens to `localhost:6379`.
MySql has enough memory and database `hs_test`. There should be table `table_test(int not null auto_increment primary key, str nvarchar(1024))`.

It has installed handlersocket plugin, which listens to `localhost:9998`.

Anonymous access should be enabled.

### How to run

1. First you should populate data:
	
	1. `node ./data/redis.js`
	2. `node ./data/mysql.js`
	
2. Then you just run the test and watch.

### Problems

1. node eats a lot CPU by itself. We are not pushing storages to its limits.

### Tests

- redis - `node-redis` library with hiredis
- ioredis - `ioredis` library with hiredis
- node-handlersocket - `node-handlersocket` library
- manual-hs - fast and dirty implementation of handlersocket protocol

### Results

As we can see from results, not surprisingly, async model is much preferrable for node.js application. Also we see that recommended client for handler-socket can't hold pressure of 500K simultaneous requests and quickly degrade.

In general handlersocket is 4 times slower than redis.

#### *Async* test on MacBook Pro 15" early 2013

````
Forest:benchmarks aensidhe$ node async_test.js
Test 'redis' started
Storage created in 4.614309 ms
Test finished: 50000 ops, 1236.75095 ms, 40428.511496190884 ops/sec

Test 'ioredis' started
Storage created in 2.343461 ms
Test finished: 50000 ops, 813.621708 ms, 61453.62090068521 ops/sec

Test 'node-handlersocket' started
Storage created in 4.943459 ms
Test finished: 50000 ops, 5085.563309 ms, 9831.752543816381 ops/sec

Test 'manual-hs' started
Storage created in 7.801034 ms
Test finished: 50000 ops, 3023.930391 ms, 16534.77214581822 ops/sec

Done
Forest:benchmarks aensidhe$ node async_test.js
Test 'redis' started
Storage created in 4.516182 ms
Test finished: 500000 ops, 10070.649113 ms, 49649.232575739334 ops/sec

Test 'ioredis' started
Storage created in 2.35571 ms
Test finished: 500000 ops, 7759.632168 ms, 64436.04402563738 ops/sec

Test 'node-handlersocket' started
Storage created in 6.440065 ms
Test finished: 500000 ops, 160374.110811 ms, 3117.710193194756 ops/sec

Test 'manual-hs' started
Storage created in 7.724447 ms
Test finished: 500000 ops, 27941.814756 ms, 17894.328065883194 ops/sec

Done
```` 

#### *Sync* test on MacBook Pro 15" early 2013

````
Forest:benchmarks aensidhe$ ./test.js
Test 'redis' started
Storage created in 4.564661 ms
Test finished: 500000 ops, 39933.318153 ms, 12520.872873230981 ops/sec

Test 'ioredis' started
Storage created in 2.866795 ms
Test finished: 500000 ops, 47065.871785 ms, 10623.408874354498 ops/sec

Test 'node-handlersocket' started
Storage created in 6.182445 ms
Test finished: 500000 ops, 117044.578581 ms, 4271.876630782844 ops/sec

Test 'manual-hs' started
Storage created in 8.893891 ms
Test finished: 500000 ops, 94308.392798 ms, 5301.755073601504 ops/sec

Done
```` 