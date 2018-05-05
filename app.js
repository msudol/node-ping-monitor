// app.js
"use strict";
var Ping = require('./ping.js');
var Runner = require('./runner.js');

// Testing a runner - send cron syntax for node-cron
var r1 = new Runner('* * * * *', function() {
    // host, port, count, interval, timeout, autostart
    var p1 = new Ping('google.com', 80, 4, 500, 2000, true);
    
});


// autostart with true at the end
var p2 = new Ping('yahoo.com', 80, 4, 500, 2000, true);
// overriding a Ping class function
p2.connect = function(stats) {
    console.info('YAHOO: ' + stats.target.host + ':' + stats.target.port + ' seq=' + stats.sent + ' time=' + stats.rtt );
    // push time into the array
    p2.rttArray.push(stats.rtt);        
}
   
   
// manually start
var p3 = new Ping('derp.derp', 80, 4, 500, 2000);
p3.init();