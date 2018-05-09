// targets.js
"use strict"

var Datastore = require('nedb');

// import ping and runner class
var Ping = require('./ping.js');
var Runner = require('./runner.js');

// create a ping class
class Target {
    
    constructor(target, db) {
    
        var self = this;
        
        this.target = target;
        this.db = db;
        this.displayName = target.host + "-" + target.port;
        
        // nedb storage 
        this.db.hosts.find({host: this.target.host, port: this.target.port}, function(err, docs) {
            
            // get a unique ish name from host-port combo
            var displayName = self.displayName;
            
            // create a new document for this host to store ping runs and stats
            self.db[self.displayName] = new Datastore({filename: 'db/' + self.displayName + '.db', autoload: true});
            
            // no docs were found
            if (docs.length == 0) {
                console.log("No NEDB document found for: " + self.displayName);
                self.db.hosts.insert(self.target, function (err, newDoc) {   
                    self.setupPing(newDoc);
                });     
            }
            
            // found 1 doc, which is all we want
            else if (docs.length == 1) {
                console.log("NEDB document found for: " + self.displayName);
                self.setupPing(docs[0]);   
            }
            
            // something else, could be more than 1 document
            //TODO: definitely need better error handling around this
            else {
                console.log("Something went wrong looking for document for: " + self.displayName);   
            }
            
        });
    
    }

    // done ping
    donePing(p) {
        
        // build better stats
        var newStats = {};

        newStats.ts = Date.now();
        newStats.name = this.displayName;
        newStats.host = this.target.host;
        newStats.port = this.target.port;
        newStats.sent = this.ping.stats.sent;
        newStats.sucess = this.ping.stats.success;
        newStats.failed = this.ping.stats.failed;
        newStats.rttAvg = this.ping.rttAvg;

        // push stats to nedb
        this.target.runs.push(newStats);
        
        this.db[this.displayName].insert(newStats, function(err, newDoc) {
            
        });
        
        console.log(this.displayName + " completed runner - total current runs: " + this.target.runs.length);    
    }
    

    // running the ping setup
    setupPing(p) {
     
        var self = this;
                
        // setup the runner
        this.runner = new Runner(p.cron, function() {    
            
            // fire the ping on the runner timer
            //targets[t].ping.init();  - doesn't work?
            
            // have to create new instance of tcpie for now.
            self.ping = new Ping(p);

            // use the complete function to get data back
            self.ping.complete = function() {
                self.donePing(p);
            }
                    
        }); 
    }

}

module.exports = Target;