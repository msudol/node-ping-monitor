// app.js
"use strict";

var Datastore = require('nedb');
var db = {};
db.targets = new Datastore({filename: 'db/targets.db', autoload: true});

var Ping = require('./ping.js');
var Runner = require('./runner.js');
 
 // setup a targets array of objects - this will go into nedb at some point.     
var targets = [
    {host:'google.com', port: 80, count: 4, interval: 500, timeout: 2000, cron: '* * * * *', autostart: true, runs: []},
    {host:'yahoo.com', port: 80, count: 4, interval: 500, timeout: 2000, cron: '* * * * *', autostart: true, runs: []},
    {host:'derp.derp', port: 80, count: 4, interval: 500, timeout: 2000, cron: '* * * * *', autostart: true, runs: []},
];

// a function to build a target
var setupTarget = function(t) {
    
    // coming soon - nedb storage of results
    db.targets.find({host: targets[t].host}, function(err, docs) {
        console.log(docs.length);
    });
    
    // setup the ping 
    targets[t].ping = new Ping(targets[t]);
    
    // setup the runner
    targets[t].runner = new Runner(targets[t].cron, function() {    
        
        // fire the ping on the runner timer
        //targets[t].ping.init();  - doesn't work?
        
        // have to create new instance of tcpie for now.
        targets[t].ping = new Ping(targets[t]);
                
    });
};

// loop through targets and set them up
for (var t = 0; t < targets.length; t++) { 
    setupTarget(t);
}





/*

old

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


*/