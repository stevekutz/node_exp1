
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
