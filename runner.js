// runner.js
"use strict"

// use the cron module
var cron = require('node-cron');

// Runner class basically constructs a node-cron job based on the string and the callback.
class Runner {
    
    // our constructor function fires on new Runner(etc)
	constructor(str, callback) {
        
        // create an instance of cron for this Runner
        this.task = cron.schedule(str, callback);      

        // start the cron task
        this.task.start();  
        
	} 
    
}

module.exports = Runner;