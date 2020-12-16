const http = require('http');

const server = http.createServer((req, res) => {
    const {url, method, headers} = req    

    console.log(url, method, headers)

});

server.listen(3000);

