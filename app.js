// app.js
"use strict";

var Datastore = require('nedb');
var db = {};
db.hosts = new Datastore({filename: 'db/targets.db', autoload: true});

// Using a unique constraint with the index
db.hosts.ensureIndex({ fieldName: 'host', unique: true }, function (err) {
    //console.error(err);
});

// import target class
var Target = require('./target.js');
 
 
 // setup a targets array of objects - this will go into nedb at some point. 
 // For now autostart is always true, we may kill that - because we should just assume it     
var targets = [
    {host:'google.com', port: 80, count: 4, interval: 500, timeout: 2000, cron: '* * * * *', autostart: true, runs: []},
    {host:'yahoo.com', port: 80, count: 4, interval: 500, timeout: 2000, cron: '* * * * *', autostart: true, runs: []},
    {host:'derp.derp', port: 80, count: 4, interval: 500, timeout: 2000, cron: '* * * * *', autostart: true, runs: []},
];


// loop through targets and set them up
for (var t = 0; t < targets.length; t++) { 
    
    // should i assign a new object to a variable here? 
    //https://stackoverflow.com/questions/2594415/is-it-bad-practice-to-not-assign-a-new-object-to-a-variable?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
    new Target(targets[t], db);
    
}


