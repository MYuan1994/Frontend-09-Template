const http = require('http')

http.createServer((request, response) => {
    let body = [];
    request.on('error', (err) => {
        console.log(err);
    }).on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        console.log("BodyZ::", body);
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(' hello world\n');
    })
}).listen(8080);

console.log("server start!!!!");