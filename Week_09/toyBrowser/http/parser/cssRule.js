const css = require('css');

let rules = [];

function addCSSSSRules(text) {
    var ast = css.parse(text);
    rules.push(...ast.stylesheet.rules);
}

function computeCSS(element,stack) {
    // slice复制栈
    // 因为由当前元素开始寻找父元素，所以寻找方向是由内向外的
    var elements = stack.slice().reverse();
    if (!element.computedStyle) {
        element.computedStyle = {};
        for (let rule of rules) {

            //复合选择器（默认的空格隔开）的处理
            //保证方向相同，同样反转一下
            //此处可以进行使用,的复合选择器的处理

            for (let selector of rule.selectors){
                var selectorParts = selector.split(" ").reverse();

                if (!match(element,selectorParts[0])) {
                    continue;
                }

                let matched = false;

                //双指针
                var j = 1;
                for (var i = 0; i < elements.length;i++){
                    if (match(elements[i],selectorParts[j])) { 
                        j++;
                    }
                }
                if (j>=selectorParts.length) { 
                    matched = true;
                }
                if (matched) {
                    var sp = specificity(selector);
                    var computedStyle = element.computedStyle;
                    for (var declaration of rule.declarations){
                        if (!computedStyle[declaration.property]) {
                            computedStyle[declaration.property] = {};
                        }
                        if (!computedStyle[declaration.property].specificity) {
                            computedStyle[declaration.property].value = declaration.value;
                            computedStyle[declaration.property].specificity = sp;
                        } else if (compare(computedStyle[declaration.property].specificity,sp)<0) {
                            computedStyle[declaration.property].value = declaration.value;
                            computedStyle[declaration.property].specificity = sp;
                        }

                    }
                }
            }

        }
    }
    return element;
}

/** 
 * 处理三种简单选择器：
 * 1.id
 * 2.class
 * 3.tagname
 * 4.*
 * 5.
 * ……更复杂的添加条件分支处理即可
*/
function match(element, selector) {
    if (!selector || !element.attributes) {
        return false;
    }

    /** 
     * 两种复合选择器：
     * 带，：表示或关系已在外部处理
     * 直接拼接：表示与关系
     * */

    let selectorList = selector.replace(/\./g, ' .').replace(/\#/g, ' #').split(" ");

    for (let selectorTemp of selectorList.filter(s=>s!=="")) {
        let result = false;
        if (selectorTemp.charAt(0) == "#") {
            var attr = element.attributes.filter(attr => attr.name ==="id")
            if (attr && attr.length>0&&attr[0].value === selectorTemp.replace("#", '')) {
                result= true;
            }
        } else if (selectorTemp.charAt(0) == ".") {
            var attrs = element.attributes.filter(attr => attr.name === "class")
            if (attrs && attrs.length > 0) {
                for (let classname of attrs[0].value.split(" ")){
                    if (classname === selectorTemp.replace(".", '')) {
                        result= true;
                    }
                }
            }
        } else if (selectorTemp==="*") { 
            result= true;
        } else{
            if (element.tagName === selectorTemp) {
                result= true;
            }
        }
        if (!result) {
            return false;
        }
    }
    return true;

    
}

function specificity(selector) {
    let p = [0, 0, 0, 0];
    var selectorParts = selector.split(' ');
    for (let part of selectorParts){
        if (part.charAt(0) == "#") {
            p[1] += 1;
        } else if (part.charAt(0) == ".") {
            p[2] += 1;
        } else if(part==="*") { 

        } else {
            p[3] += 1;
        }
    }

    return p;
}

function compare(sp1,sp2) {
    if (sp1[0] - sp2[0]) { return sp1[0] - sp2[0] }
    if (sp1[1] - sp2[1]) { return sp1[1] - sp2[1] }
    if (sp1[2] - sp2[2]) { return sp1[2] - sp2[2] }
    return sp1[3] - sp2[3];
}


module.exports = { addCSSSSRules,computeCSS };