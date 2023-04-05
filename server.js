const http = require('http');
const app = require('./app');

//Port on which want to run server
const port = process.env.PORT || 3000;

//creating new server
const server = http.createServer(app);

//start listening on this port
server.listen(port);

