var regexp = /([0-9\.]+)|([\t]+)|([\r\n]+)|(\*)|(\/)|(\+)|(\-)/g;

var dictionary = ["Number", "Whitespace", "LineTerminator", "*", "/", "+", "-"];

function* tokenize(source) {
    let result = null;
    let lastindex = 0;
    while (true) {
        lastindex = regexp.lastIndex;
        result = regexp.exec(source);
        try {
            if (!result)
                throw new Error("未匹配到结果");
        } catch (exception) {
            console.log(exception.message);
            break;
        }
        if (regexp.lastIndex - lastindex > result[0].length) {
            break;
        }
        let token = {
            type: null,
            value: null
        }

        for (let i = 1; i <= dictionary.length; i++) {
            if (result[i]) {
                token.type = dictionary[i - 1];
            }
        }
        token.value = result[0];
        yield token;
    }
    yield {
        type: "EOF"
    }
}

// for (let token of tokenize("12+23*34")) {
//     console.log(token);
// };