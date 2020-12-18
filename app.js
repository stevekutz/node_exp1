const http = require('http');   // Node's way of importing modules, files

const fs = require('fs')

let count = 0;

// Date is imported by default in Node, import NOT needed
// return date is MM/DD/YYYY format
const writeDate_CB = () => {    
    let dateObj = new Date;
    let year = dateObj.getFullYear();
    let month = ('1' + (dateObj.getMonth() + 1)).slice(-2);  // e.g. 03, 10  starts at 0
    let day = ('0' + dateObj.getDate()).slice(-2);

    let dateStr = month + '/' + day + '/' +  year
    console.log(dateStr)
    return dateStr
}

// createServer contains a `requestListener` function
const server = http.createServer((req, res) => {
    const {url, method, headers} = req    
    count += 1

    // an inefficient way to write HTML to browser 
    //    action points to route where request data is sent
    // form method defines POST request with data sent to router message
    // form tag looks for other data. From input, any input defined with name attribute gets attached as key-value pairs to body of request
    // key is name & value is user input
    if (url ==='/') {
        res.write('<html><head><title> First Node Page </title></head>');
        res.write('<body><form action = "/message" method = "POST"><input type = "text" name = "message"/><button type = "Submit"> Send </button> </form></body>');
        res.write('</html>');
        // Indicates response message complete. Node send response to client where browser looks at header to know how to render
        // response.end() MUST be called on each response !!!
        return res.end(); 
    }

    console.log( "Req obj  url, method, & headers section")  
    console.log(" \n url => ", url);
    console.log(" \n method => ", method);
    console.log(" \n headers => ", headers);

    // if route matches, write to file and end
    if (url === '/message' && method === 'POST') {
        const body = []
        
        // `on` is an event listener, looks for `data` event and then runs the listener callback function
        //  `chunk` is a part of the data(either a string of part of the `Buffer`)
        req.on('data', (chunk) => {
            console.log(chunk)
            body.push(chunk)
        });

        // `on` is an event listener, looks for `end` event and then runs the listener callback function
        //    event NOT emitted until no more data is available
        // global Buffer class is used to manage data transfers(e.g. chunks of data from entire amount of data) from a stream of data
        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            console.log("parsedBody ",  parsedBody);
            const message = parsedBody.split('=')[1]; // split on `=` separator and take value (e.g. index 1)
            fs.writeFile('message.txt', message, error => {
                if (error){
                    res.json(error);
                    res.message("Error occured")
                    console.log("Error during write ", error)
                }
                res.statusCode = 302;  //only sent when file write complete
                // res.setHeader('Location', '/');  // Cannot set headers after they are sent to the client
                console.log(res.StatusCode)
                return res.end(writeDate_CB); // last parameter is passed a CB
            });
        })
    }

    // without res.end(), this never gets sent and server keeps running
    res.setHeader('Location', '/');  // writes metadata
    res.setHeader('Content-Type', 'text/html');
    res.write(`<html><head><title> First Node Page </title></head><body><h1> Node Server Running ${count}</h1> </body></html>`);
    console.log("\t\t ", count)
    res.end();
});

server.listen(3000);

