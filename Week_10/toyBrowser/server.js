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
            #flexContainer{
                width:500px;
                height:300px;
                display:flex;
                background-color:rgb(255,255,255);
            }
            #itemA{
                width:200px;
                height:200px;
                background-color:rgb(255,0,0);
            }
            #flexContainer .item{
                flex:1;
                background-color:rgb(0,255,0);
            }
    </style>
    <body>
        <div id="flexContainer">
            <div id="itemA">AAA</div>
            <div class="item">BBB</div>
        </div>
    </body>
</html>`)
    })
}).listen(8080);

console.log("server start!!!!");