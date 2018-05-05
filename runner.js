// runner.js
"use strict"

// use the cron module
var cron = require('node-cron');

class Runner {
    
    // our constructor function fires on new Runner(etc)
	constructor(str, callback) {
        
        var self = this;

        // create an instance of cron for this Runner
        this.task = cron.schedule(str, callback);      

        this.task.start();  
        
	} 
    
}

module.exports = Runner;