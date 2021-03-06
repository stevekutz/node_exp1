
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

2. Verify terminal output for req data
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

    <img src = "readme_img/Node_write_html.png" width = "50%" />

#### Setting up routes and passing in data to a file

1. Create a form using the `POST` method with an input field and use event listeners to capture and write data to a file.

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

2. Rewrite the event listener looking for the `end` event to use an asynchronous file write.

    - `fs.writeFile` is a convenience method that performs multiple write calls internally to write the buffer passed to i
    - Use the error callback convention
    - Note the event driven architecture used with Node and callbacks


    ~~~ js
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
    ~~~

##### Create file dedicated to routing logic

3. Create `routes.js` in same directory as `app.js` (MUST share same directory) and move all routing logic.

    - If only a single function is in `routes.js`, the following syntax would suffice

        ~~~ js
        // routes.js
        .....

        module.exports = requestHandler
        ~~~
        ~~~
        // app.js
        const http = require('http');   // Node's way of importing modules, files

        const routes = require('./routes')

        // createServer contains a `requestListener` function
        const server = http.createServer(requestHandler)

        server.listen(3000);
        ~~~

    - Note how the 3 different exports from `routes` are called in `createServer` of `app.js`

        ~~~ js
        // app.js
        const http = require('http');   // Node's way of importing modules, files

        const routes = require('./routes')

        // createServer contains a `requestListener` function
        const server = http.createServer(routes.requestHandler, routes.writeDate_CB, routes.count)

        // const server = http.createServer(requestHandler, writeDate_CB, count)

        server.listen(3000);
        ~~~

        ~~~ js
        // routes.js
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
                
        const requestHandler = (req, res) => {
            const {url, method, headers} = req


            count += 1;


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

        }

        // module.exports is a global Node obj

        // EXPORT syntax 1
        // module.exports.requestHandler = requestHandler
        // module.exports.writeDate_CB = writeDate_CB
        // module.exports.count = count

        // EXPORT syntax 2
        exports.requestHandler = requestHandler
        exports.writeDate_CB = writeDate_CB
        exports.count = count


        // EXPORT syntax 3
        // module.exports = {
        //     requestHandler: requestHandler,
        //     writeDate_CB: writeDate_CB,
        //     count: count

        // }
        ~~~
  
4) Setup `package.json` 

    - From terminal run `npm init`
    - Update the `scripts` section

        ~~~ json
        "scripts": {
            "test": "echo \"Error: no test specified\" && exit 1",
            "start": "node app.js",
            "start-server": "node app.js"
        },
        ~~~

    - Running `npm start` will launch server. `start` is special and does not need `run`
    - Running `npm run start-server` will launch server. Note than `run` must be included

5) Install 3rd party packages

    - `--save-dev` saves as a development dependency, runs only in dev mode
    - `--save` saves as a production depdency, runs only in production environment
    - `-g` does not save dependency to project but instead installs globally on machine
    - Run the following:

        ~~~ bash
        npm install nodemon --save-dev
        ~~~
    - this creates `package-lock.json` that represents the dependency tree of the project's installed packages
    - packages are installed in the `node_modules` folder
    - note that this now shows as a dev dependency inside `package.json`

    ~~~ json
    "devDependencies": {
        "nodemon": "^2.0.6"
    }
    ~~~

    - update `package.json` to use `nodemon`. This cannot be run in terminal unless `nodemon` was installed globally.

        ~~~ json
        "scripts": {
            "test": "echo \"Error: no test specified\" && exit 1",
            "start": "nodemon app.js",
            "start-server": "node app.js"
        },
        ~~~