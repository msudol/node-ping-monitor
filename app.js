var tcpie = require('tcpie');
var pie = tcpie('site.example.com', 80, {count: 4, interval: 500, timeout: 2000});
 
pie.on('connect', function(stats) {
  console.info('connect', stats);
}).on('error', function(err, stats) {
  console.error(err, stats);
}).on('timeout', function(stats) {
  console.info('timeout', stats);
}).on('end', function(stats) {
  console.info(stats);
  // -> {
  // ->   sent: 10,
  // ->   success: 10,
  // ->   failed: 0,
  // ->   target: { host: 'google.com', port: 80 }
  // -> }
}).start()
