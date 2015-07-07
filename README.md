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

### Results on MacBook Pro 15" early 2013

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