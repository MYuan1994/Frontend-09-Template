const Request = require("./http/Request")
const parserHTML = require("./http/parser/parser");
const render = require('./render/render');
var images = require("images");

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
    let viewport = images(800, 600);
    render(viewport,dom.children[0].children[3].children[1].children[1])
    viewport.save("ZZZZZ.jpg");
    
    // console.log(JSON.stringify(dom, null, "   "));
    console.log("create dom success!!!");
}();