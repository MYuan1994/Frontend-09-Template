const net = require("net");
const ResponseParser = require("./ResponseParser");

class Request { 
    constructor(options) { 
        //为request参数预设默认值
        this.method = options.method || "GET";
        this.host = options.host;
        this.port = options.port || 80;
        this.path = options.path || "/";
        this.body = options.body || {};
        this.headers = options.headers || {};
        if (!this.headers["Content-Type"]) {
            this.headers["Content-Type"] = "application/x-www-form-urlencoded";
        }
        if (this.headers["Content-Type"] === "application/json") {
            this.bodyText = JSON.stringify(this.body);
        } else if (this.headers["Content-Type"] === "application/x-www-form-urlencoded") { 
            this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&');
        }

        this.headers["Content-Length"] = this.bodyText.length;

    }
    send(connection){ 
        return new Promise((resolve, reject) => { 
            const parser = new ResponseParser();
            if (connection) {
                connection.write(this.toString());
            } else { 
                connection = net.createConnection({
                    host: this.host,
                    port: this.port
                }, () => { 
                    connection.write(this.toString());    
                })
            }
            connection.on('data', (data) => { 
                console.log(data.toString());
                parser.receive(data.toString());
                if (parser.isFinished) { 
                    resolve(parser.response);
                    connection.end();
                }
            })
            connection.on('error', (err) => { 
                reject(err);
                connection.end();
            })
        })
    }

    // 整理格式为：
    // 1. request line：第一行，例子：POST / HTTP/1.1，由三部分构成
    //     - method：POST或者GET（另有Delete、Put、options等）
    //     - / ：路径
    //     - HTTP/1.1：HTTP和HTTP版本
    // 2. Headers：多行，每行是由冒号分隔的Key-Value格式；以空行为结束标志。
    // 3. body：由Content-Type决定；为区分换行使用\r\n两个
    toString() { 
        return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}:${this.headers[key]}`).join('\r\n')}\r
\r
${this.bodyText}`
    }
}


module.exports = Request;