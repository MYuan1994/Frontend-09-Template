const { emitS } = require('./syntax');

const EOF = Symbol("EOF");

let stack;
let currentToken = null;
let currentAttribute = null;

function emit(token) {
    stack=emitS(token,stack)
}

function data(c) { 
    if (c=="<") {
        return tagOpen;
    } else if (c==EOF) {
        emit({
            type:"EOF"
        })
        return;
    } else { 
        emit({
            type: "text",
            content:c
        })
        return data;
    }
}

function tagOpen(c) { 
    if (c=="/") {
        return endTagOpen;
    } else if (c.match(/^[a-zA-Z]$/)) {
        //暂时无法区分开始/自封闭，故将自封闭标签看作startTag，后面添加属性selfClosing区分
        currentToken = {
            type: "startTag",
            tagName:""
        }
        return tagName(c);
    } else { 
        emit({
            type: "text",
            content:c
        })
        return data;
    }
}

function endTagOpen(c) {
    if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: "endTag",
            tagName:""
        }
        return tagName(c);
    }
    // else if (c == ">") {
    // } else if (c == EOF) {
    // } else { 
    // }
}

/**
     * 分支情况分别为：
     * tag通过换行、换页、制表、空格终结
     * /代表tag为自封闭标签
     * 继续标签的输入
     * 标签结束，接受新的输入的状态
     * 标签内其他书写
    */
function tagName(c) {
    if (c.match(/^[\n\f\t ]$/)) {
        return beforeAttributeName;
    } else if (c == "/") {
        return selfClosingStartTag;
    } else if (c.match(/^[a-zA-Z]$/)) {
        currentToken.tagName += c;
        return tagName;
    } else if (c == ">") {
        emit(currentToken);
        return data;
    } else {
        currentToken.tagName += c;
        return tagName;
    }
}

function beforeAttributeName(c) {
    if (c.match(/^[\n\f\t ]$/)) {
        return beforeAttributeName;
    } else if (c == "/"||c == ">"||c == EOF) {
        return afterAttributeName(c);
    } else if (c == "=") {
        
    } else {
        currentAttribute = {
            name:"",
            value:""
        }
        return attributeName(c);
    }
}

function attributeName(c) {

    if (c.match(/^[\n\f\t ]$/)||c == "/"||c == ">"||c == EOF) {
        return afterAttributeName;
    } else if (c == "=") {
        return beforeAttributeValue;
    } else if (c == "\u0000") {
        
    } else if (c=="\""||c=="'"||c=="<") { 

    }else {
        currentAttribute.name += c;
        return attributeName;
    }
}

function afterAttributeName(c) { 
    if (c.match(/^[\n\f\t ]$/)) {
        return afterAttributeName;
    } else if (c == "/") {
        return selfClosingStartTag;
    } else if (c == "=") {
        return beforeAttributeValue;
    } else if (c==">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (c==EOF) { 

    } else {
        currentToken[currentAttribute.name] = currentAttribute.value;
        currentAttribute = {
            name:"",
            value:""
        }
        return attributeName(c);
    }
}

function beforeAttributeValue(c) {
    if (c.match(/^[\n\f\t ]$/)||c == "/"||c == ">"||c == EOF) {
        return beforeAttributeName;
    } else if (c == "\"") {
        return doubleQuotedAttributeValue;
    } else if (c == "\'") {
        return singleQuotedAttributeValue;
    } else if (c==">") { 

    }else {
        return UnquotedAttributeValue(c);
    }
}

function UnquotedAttributeValue(c) {
    if (c.match(/^[\n\f\t ]$/)) {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return beforeAttributeName;
    } else if (c == "/") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return selfClosingStartTag;
    } else if (c == ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (c == "\u0000") {
        
    } else if (c=="\""||c=="'"||c=="<"||c=="="||c=="`") { 

    } else if (c==EOF) { 

    } else {
        currentAttribute.value += c;
        return UnquotedAttributeValue;
    }
}

function doubleQuotedAttributeValue(c) {
    if (c == "\"") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if (c == "\u0000") {

    } else if (c == EOF) {

    } else { 
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
}

function singleQuotedAttributeValue(c) {
    if (c == "\'") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if (c == "\u0000") {

    } else if (c == EOF) {

    } else { 
        currentAttribute.value += c;
        return singleQuotedAttributeValue;
    }
}

function afterQuotedAttributeValue(c) { 
    if (c.match(/^[\n\f\t ]$/)) {
        return beforeAttributeName;
    } else if (c == "/") {
        return selfClosingStartTag;
    } else if (c == ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (c ==EOF) {
    } else{ 
        throw new Error("unexpected charater \""+c+"\"");
    }
}

function selfClosingStartTag(c) {
    if (c == ">") {
        currentToken.isSelfClosing = true;
        return data;
    } else if (c == EOF) {
        
    } else {

    }
}


export function parserHTML(html) {
    stack = [{ type: "document", children: [] }];
    currentToken = null;
    currentAttribute = null;

    let state = data;
    for (let char  of html){
        state = state(char);
    }
    state = state(EOF);

    return stack[0];
}

// module.exports =  parserHTML ;