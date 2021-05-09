const TrunkedBodyParse = require("./TrunkedBodyParse");

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

module.exports = ResponseParser;