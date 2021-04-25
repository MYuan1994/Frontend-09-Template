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

module.exports = TrunkedBodyParse;