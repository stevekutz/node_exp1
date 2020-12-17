const http = require('http');   // Node's way of importing modules, files

//
const server = http.createServer((req, res) => {
    const {url, method, headers} = req    

    console.log( "Req obj  url, method, & headers section")  
    console.log(" \n url => ", url);
    console.log(" \n method => ", method);
    console.log(" \n headers => ", headers);

    res.setHeader('Content-Type', 'text/html');
    res.write('<html><head><title> First Node Page </title></head><body><h1> Node Server Running </h1> </body></html>')
    res.end
});

server.listen(3000);

