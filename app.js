const http = require('http');   // Node's way of importing modules, files

const fs = require('fs')
//
const server = http.createServer((req, res) => {
    const {url, method, headers} = req    


    if (url ==='/') {
        res.write('<html><head><title> First Node Page </title></head>');
        res.write('<body><form action = "/message" method = "POST"><input type = "text" name = "message"/><button type = "Submit"> Send </button> </body></form>');
        res.write('</html>');
        return res.end();
    }

    console.log( "Req obj  url, method, & headers section")  
    console.log(" \n url => ", url);
    console.log(" \n method => ", method);
    console.log(" \n headers => ", headers);

    // if route matches, writeto file and end
    if (url === '/message' && method === 'POST') {
        const body = []
        
        req.on('data', (chunk) => {
            console.log(chunk)
            body.push(chunk)
        });
        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            console.log("parsedBody ",  parsedBody);
            const message = parsedBody.split('=', 1);
        })

        fs.writeFileSync('message.txt', 'DummyData test write');
        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end();
    }


    res.setHeader('Content-Type', 'text/html');
    res.write('<html><head><title> First Node Page </title></head><body><h1> Node Server Running </h1> </body></html>');
    res.end();
});

server.listen(3000);

