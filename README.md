# Node Ping Monitor

This is going to be a ping monitoring application based on the node module 'tcpie' which emulates 'ping'.

## Roadmap

We're going to extend tcpie is such a manner that it can be used to monitor multiple systems and log results to a JSON database like NEDB, and eventually will also provide a web client.

## Other thoughts

### HTTP Monitor

Eventually implement an http response checker on top of the ping checker - to get more meaningful data, perhaps via prometheus metrics checks.

### SNMP Monitor

Possibly use https://www.npmjs.com/package/net-snmp - to implement an snmp monitor.

### WMI Integration

Eventually implement a node-wmi library and do wmi inspection of windows hosts.





