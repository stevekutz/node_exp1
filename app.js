const http = require('http');   // Node's way of importing modules, files

const routes = require('./routes')

// createServer contains a `requestListener` function
const server = http.createServer(routes.requestHandler, routes.writeDate_CB, routes.count)

// const server = http.createServer(requestHandler, writeDate_CB, count)

server.listen(3000);

