
#### Simple server setup
1. Run node app.js in terminal. No reponse until the browser is launched at localhost:3000


    ~~~ js
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
    });
    ~~~

2. Verify terminal out for req data
    ~~~ bash
    Req obj  url, method, & headers section
    
    url =>  /
    
    method =>  GET
    
    headers =>  {
    host: 'localhost:3000',
    connection: 'keep-alive',
    'cache-control': 'max-age=0',
    'sec-ch-ua': '"Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"',
    'sec-ch-ua-mobile': '?0',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'sec-fetch-site': 'none',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-user': '?1',
    'sec-fetch-dest': 'document',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en-US,en;q=0.9'
    }
    ~~~

3. Verify browser renders HTML
<img src = "readme_img/Node_write_html.png"/>


#### Setting up routes and passing in data to a file
- A form is used to capture user data and attached to the response body
- The name attribute becomes the attached key & user input becomes the value
- The form action directs where request data is sent
- For the req obj:
  - the `on` event listener looks for `data` events and then runs the listener callback function
  - the `on` event listener looks for an `end` event and reads data using the global `Buffer` class, converting it to string.
  - from the passed in key-value data, the value portion is split and read into the parsedBody Buffer
  - a `synchronous` file write is used. Data is overwritten is file not empty.
- The `writDate_CB` callback is called after the header location set to '/' 
- Note: If the header location set to `/message`, then the `Node Server Running` html can be seen
- The `writeDate` is used for the 
- A count variable is used to verify how the `requestListener` behaves
- The `dateStr` callback is passed to the response process within the if statement 
- The final response process is exited with `res.end()`
    ~~~ js
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
                fs.writeFileSync('message.txt', message);  // write input value to file 
            })

            res.statusCode = 302;
            res.setHeader('Location', '/');  // writes metadata
            return res.end(writeDate_CB); // last parameter is passed a CB

        }

        // without res.end(), this never gets sent and server keeps running
        res.setHeader('Content-Type', 'text/html');
        res.write(`<html><head><title> First Node Page </title></head><body><h1> Node Server Running ${count}</h1> </body></html>`);
        console.log("\t\t ", count)
        res.end();
    });

    server.listen(3000);
    ~~~
