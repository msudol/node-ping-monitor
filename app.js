// app.js
"use strict";

var Datastore = require('nedb');
var db = {};
db.hosts = new Datastore({filename: 'db/targets.db', autoload: true});

// Using a unique constraint with the index
db.hosts.ensureIndex({ fieldName: 'host', unique: true }, function (err) {
    //console.error(err);
});

var Ping = require('./ping.js');
var Runner = require('./runner.js');
 
 // setup a targets array of objects - this will go into nedb at some point. 
 // For now autostart is always true, we may kill that - because we should just assume it     
var targets = [
    {host:'google.com', port: 80, count: 4, interval: 500, timeout: 2000, cron: '* * * * *', autostart: true, runs: []},
    {host:'yahoo.com', port: 80, count: 4, interval: 500, timeout: 2000, cron: '* * * * *', autostart: true, runs: []},
    {host:'derp.derp', port: 80, count: 4, interval: 500, timeout: 2000, cron: '* * * * *', autostart: true, runs: []},
];

// a function to build a target
var setupTarget = function(t) {
    
    // coming soon - nedb storage of results
    db.hosts.find({host: targets[t].host}, function(err, docs) {
        
        // no docs
        if (docs.length == 0) {
            console.log("No NEDB document found for: " + targets[t].host + " - creating one!");
            
            db.hosts.insert(targets[t], function (err, newDoc) {   
                // Callback is optional
                // newDoc is the newly inserted document
                setupPing(newDoc);
            });
            
        }
        // found 1 doc, which is all we want
        else if (docs.length == 1) {
            console.log("NEDB document found for: " + targets[t].host);
            
            setupPing(docs[0]);
            
        }
        // something else, could be more than 1 document
        //TODO: definitely need better error handling around this
        else {
            console.log("Something went wrong looking for document for: " + targets[t].host);
            
        }
        
    });
    
};

// function to call when ping is complete
var donePing = function(p) {
    p.ping.runs.push(p.ping.stats);
    p.ping.target.runs = p.ping.runs;
    console.log(p.ping.host + " completed ping - total runs: " + p.ping.runs.length);    
};

// running the ping setup
var setupPing = function(p) {
 
    // setup the ping and run 
    p.ping = new Ping(p);
    
    // use the complete function to get data back
    p.ping.complete = function() {
        donePing(p);
    }
    
    // setup the runner
    p.runner = new Runner(p.cron, function() {    
        
        // fire the ping on the runner timer
        //targets[t].ping.init();  - doesn't work?
        
        // have to create new instance of tcpie for now.
        p.ping = new Ping(p);

        // use the complete function to get data back
        p.ping.complete = function() {
            donePing(p);
        }
                
    }); 
}

// loop through targets and set them up
for (var t = 0; t < targets.length; t++) { 
    setupTarget(t);
}


