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
        
        // coming soon - nedb storage of results
        this.db.hosts.find({host: this.target.host}, function(err, docs) {
            
            // no docs
            if (docs.length == 0) {
                console.log("No NEDB document found for: " + self.target.host + " - creating one!");
                self.db.hosts.insert(self.target, function (err, newDoc) {   
                    // Callback is optional
                    // newDoc is the newly inserted document
                    self.setupPing(newDoc);
                });
                
                self.db[self.target.host] = new Datastore({filename: 'db/'+self.target.host+'.db', autoload: true});
                
            }
            // found 1 doc, which is all we want
            else if (docs.length == 1) {
                console.log("NEDB document found for: " + self.target.host);
                self.setupPing(docs[0]);   
            }
            // something else, could be more than 1 document
            //TODO: definitely need better error handling around this
            else {
                console.log("Something went wrong looking for document for: " + self.target.host);   
            }
        });
    
    }

    // done ping
    donePing(p) {
        p.ping.runs.push(p.ping.stats);
        p.ping.target.runs = p.ping.runs;
        console.log(p.ping.host + " completed ping - total runs: " + p.ping.runs.length);    
    }
    

    // running the ping setup
    setupPing(p) {
     
        var self = this;
        
        // setup the ping and run 
        p.ping = new Ping(p);
        
        // use the complete function to get data back
        p.ping.complete = function() {
            self.donePing(p);
        }
        
        // setup the runner
        p.runner = new Runner(p.cron, function() {    
            
            // fire the ping on the runner timer
            //targets[t].ping.init();  - doesn't work?
            
            // have to create new instance of tcpie for now.
            p.ping = new Ping(p);

            // use the complete function to get data back
            p.ping.complete = function() {
                self.donePing(p);
            }
                    
        }); 
    }

}

module.exports = Target;