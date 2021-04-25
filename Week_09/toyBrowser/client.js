const Request=require("./http/Request")
const parserHTML = require("./http/parser/parser");

void async function () {
    let request = new Request({
        method: "POST",
        host: "127.0.0.1",
        port: "8080",
        path: "/",
        headers: {
            ["X-Foo2"]: "customed"
        }, body: {
            name: "ZMY"
        }
    });

    let response = await request.send();

    let dom = parserHTML(response.body);
    
    console.log(JSON.stringify(dom, null, "   "));
    console.log("create dom success!!!");
}();