const http = require('http')

http.createServer((request, response) => {
    let body = [];
    request.on('error', (err) => {
        console.error(err);
    }).on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(
`<html lang="en">
    <head>
        <title>Document</title>
    </head>
    <style>
            #divA{
                width:200px;
                background:#AAA;
            }
            body #divB{
                width:200px;
                background:#666;
            }
            div{
                height:20px;
            }
            .black{
                color:#000;
            }
            .bold{
                font-weight:bold;
            }
            .bold,#divA{
                font-size:50px;
            }
            .bold#divA{
                font-style: italic;
            }
            .black#divB{
                font-style: italic;
            }
            *{
                color:#000;
            }
    </style>
    <body>
        <div id="divA">AAA</div>
        <input/>
        <div class="black bold" id="divB">BBB</div>
    </body>
</html>`)
    })
}).listen(8080);

console.log("server start!!!!");