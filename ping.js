// ping.js
"use strict"

// use the tcpie module
var tcpie = require('tcpie');

// create a ping class
class Ping{
     
    // our constructor function fires on new Ping(etc)
    //(targets[t].host, targets[t].port, targets[t].count, targets[t].interval, targets[t].timeout, targets[t].autostart, targets[t].runs)
	constructor(target) {
        var self = this;
        this.target = target;
		this.host = target.host;
		this.port = target.port;
        this.settings = {
            count: target.count,
            interval: target.interval,
            timeout: target.timeout
        };
        // maintain array of round trip times
        this.rttArray = [];
        this.rttAvg = null;
        this.stats = {};
        this.runs = target.runs;
        this.autostart = target.autostart;
        
        // create an instance of tcpie for this ping
        this.pie = tcpie(this.host, this.port, this.settings);
        
        // setup event handlers
        this.pie.on('connect', function(stats) {         
            self.connect(stats)
        }).on('error', function(err, stats) {
            self.error(err, stats)
        }).on('timeout', function(stats) {
            self.timeout(stats)
        }).on('end', function(stats) { 
            self.end(stats)
        });  
        
        if (this.autostart) {
            this.init();
        }
        
	}

    // init function runs start.
    init() {
        console.log("starting");
        this.pie.start();
    }
    
    connect(stats) {
        console.info('connected to: ' + stats.target.host + ':' + stats.target.port + ' seq=' + stats.sent + ' time=' + stats.rtt );
        // push time into the array
        this.rttArray.push(stats.rtt);        
    }
    
    error(err, stats) {
        console.error(err, stats);
    }
    
    timeout(stats) {
        console.info('timeout', stats);
    }
    
    // function called when event ends
    end(stats) {
        
        if (this.rttArray.length > 0) {
            this.rttAvg = this.rttArray.reduce((total, amount, index, array) => {
                total += amount;
                if(index === array.length-1) { 
                    return total/array.length;
                } else { 
                    return total;
                }
            });
        }
        
        this.stats = stats;
        
        console.info('finished: ' + stats.target.host + ':' + stats.target.port + ' success=' + stats.success + ' failed=' + stats.failed +  ' avg=' + this.rttAvg );
        
        this.complete();
    }
    
    
    // tally up some stats, return to the runner - should add the timestamp, prep for database storage and the like.
    complete() {
        
        this.runs.push(this.stats);
        this.target.runs = this.runs;
        console.log(this.stats.target.host + " completed ping - total runs: " + this.runs.length);
        
        
    }
    
}
	
module.exports = Ping;