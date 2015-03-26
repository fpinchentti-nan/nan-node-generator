/**
* <%= applicationName %> main file.
*
* @module <%= applicationName %>
*/
var settings = require('./<%= configurationFile %>');
<% if (libexpress) { %>var express = require('express');
var app = express();
var routes = require('./src/routes');

app.use('/', routes);
console.log('Server listening on port: ',settings.express.port);
app.listen(settings.express.port);<% } %>
