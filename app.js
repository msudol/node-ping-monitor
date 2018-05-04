// app.js
"use strict";
var Ping = require('./Ping.js');

var p1 = new Ping('google.com', 80, 4, 500, 2000);

p1.init();