const net = require("net");

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

class ResponseParser{ 
    constructor() {
        //状态常量，需要区分接收\r
        //此处的状态机使用函数实现更好，TODOLIST
        this.WAITING_STATUS_LINE = 0;
        this.WAITING_STATUS_LINE_END = 1;

        this.WAITING_HEADER_NAME = 2;
        this.WAITING_HEADER_SPACE = 3;
        this.WAITING_HEADER_VALUE = 4;
        this.WAITING_HEADER_LINE_END = 5;

        this.WAITING_HEADER_BLOCK_END = 6;//结束标志的空行
        this.WAITING_BODY = 7;

        //预设初始值statusLine,body,headers
        this.current = this.WAITING_STATUS_LINE;
        this.statusLine = "";
        this.headers = {};
        this.headerName = "";
        this.headerValue = "";
        this.bodyParser = null;
    }

    get isFinished() { 
        return this.bodyParser && this.bodyParser.isFinished;
    }

    get response() { 
        this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
        return {
            statusCode: RegExp.$1,
            statusText: RegExp.$2,
            headers: this.headers,
            body: this.bodyParser.content.join('')
        }
    }

    receive(string) { 
        for (let i = 0; i < string.length;i++) { 
            this.receiveChar(string.charAt(i));
        }
    }
    receiveChar(char) { 
        // 若状态机为函数式，此处逻辑可以更清晰
        if (this.current === this.WAITING_STATUS_LINE) {
            // statusLine是否结束?进入下一个状态:继续拼接statusLine
            if (char === '\r') {
                this.current = this.WAITING_STATUS_LINE_END;
            } else { 
                this.statusLine += char;
            }
        } else if (this.current === this.WAITING_STATUS_LINE_END) {
            //等待回车\n进入header解析状态
            if (char === '\n') {
                this.current = this.WAITING_HEADER_NAME;
            }
        }else if (this.current===this.WAITING_HEADER_NAME) {
            //等待冒号以切换WAITING_HEADER_SPACE
            //等待\r表示空行转换WAITING_HEADER_BLOCK_END
            if (char === ':') {
                this.current = this.WAITING_HEADER_SPACE;
            } else if (char==='\r') {
                this.current = this.WAITING_HEADER_BLOCK_END;
                if (this.headers['Transfer-Encoding']==='chunked') { 
                    this.bodyParser = new TrunkedBodyParse();
                }
            } else { 
                this.headerName += char;
            }
        }else if (this.current===this.WAITING_HEADER_SPACE) {
            // k转v的必经空格，切换value的处理状态
            if (char === ' ') {
                this.current = this.WAITING_HEADER_VALUE;
            }
        } else if (this.current === this.WAITING_HEADER_VALUE) {
            // 一对KV结束，添加进headers并重置name和value
            if (char === '\r') {
                this.current = this.WAITING_HEADER_LINE_END;
                this.headers[this.headerName] = this.headerValue;
                this.headerName = "";
                this.headerValue = "";
            }else { 
                this.headerValue += char;
            }
        }else if (this.current===this.WAITING_HEADER_LINE_END) {
            // 等回车继续键入下个KV
            if (char === '\n') {
                this.current = this.WAITING_HEADER_NAME;
            }
        }else if (this.current===this.WAITING_HEADER_BLOCK_END) {
            // 等回车进入WAITING_BODY
            if (char === '\n') {
                this.current = this.WAITING_BODY;
            }
        } else if (this.current === this.WAITING_BODY) {
            //但拿出去处理
            this.bodyParser.receiveChar(char);
        }
    }
}

class TrunkedBodyParse{ 
    constructor() {
        // Trunk:长度+内容；故以接收到长度为0的trunk为终结
        this.WAITING_LENGTH = 0;
        this.WAITING_LENGTH_LINE_END = 1;

        // 非严格米利状态机
        // 因为chunk可以接受任何字符，故使用预读长度控制大小
        this.READING_TRUNK = 2;

        this.WAITING_NEW_LINE = 3;
        this.WAITING_NEW_LINE_END = 4;

        this.length = 0;
        this.isFinished = false;
        this.content = [];
        this.current = this.WAITING_LENGTH;
    }
    receiveChar(char) {
        if(this.current === this.WAITING_LENGTH) {
            if(char === '\r') {
                if(this.length === 0) {
                    this.isFinished = true;
                }
                this.current = this.WAITING_LENGTH_LINE_END;
            } else {
                this.length *= 16;
                this.length += parseInt(char, 16);
            }
        } else if (this.current === this.WAITING_LENGTH_LINE_END) {
            // 中间状态处理换行
            if(char === '\n') {
                this.current = this.READING_TRUNK;
            }
        } else if(this.current === this.READING_TRUNK) {
            this.content.push(char);
            this.length--;
            // if (this.isFinished) {
            //     return ;
            // }
            if(this.length === 0) {
                this.current = this.WAITING_NEW_LINE;
            }
        } else if(this.current === this.WAITING_NEW_LINE) {
            if(char === '\r') {
                this.current = this.WAITING_NEW_LINE_END;
            }
        } else if (this.current === this.WAITING_NEW_LINE_END) {
            // 中间状态处理换行
            if(char === '\n') {
                this.current = this.WAITING_LENGTH;
            }
        }
    }
}


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

    console.log(response);
}();