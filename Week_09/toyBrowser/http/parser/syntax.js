// tree-construction
const { addCSSSSRules,computeCSS }=require('./cssRule')

let currentTextNode = null;

/**token:{
 *  type,
 *  tagName,
 *  attributes[]
 * }
*/
function emitS(token,stack) {
    
    let top = stack[stack.length-1]
    if (token.type == "startTag") { 
        let element = {
            type: "element",
            children: [],
            attributes: []
        };
        element.tagName = token.tagName;

        for (let p in token){
            if (p!="type"&&p!="tagName") { 
                element.attributes.push({
                    name: p,
                    value:token[p]
                })
            }
        }

        element = computeCSS(element, stack);

        top.children.push(element);
        // element.parent = top;

        if (!token.isSelfClosing) {
            stack.push(element);
        }
        currentTextNode = null;

    } else if (token.type == "endTag") {
        if (top.tagName != token.tagName) { 
            //可以实现自动添加结束标签完成封闭以增加容错性，暂时不做
            throw new Error("Tag start end doesn't match!!!");
        } else {
            //收集style标签内css规则
            //缺失link标签内css规则的收集
            if (top.tagName==="style") {
                addCSSSSRules(top.children[0].content);
            }

            stack.pop();
        }
        currentTextNode = null;
    } else if (token.type == "text") { 
        if (currentTextNode==null) { 
            currentTextNode = {
                type: "text",
                content:""
            }
            top.children.push(currentTextNode);
        }
        currentTextNode.content += token.content;
    }

    return stack;
}

module.exports = { emitS };