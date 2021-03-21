let windCardFind = (source, pattern) => {
    let starCount = 0;
    for (let i of pattern) {
        if (i === "*") {
            starCount++;
        }
    }
    console.log(starCount);

    //无*，字符串可以按位匹配,非?且不匹配即错误
    if (starCount === 0) {
        for (let i in pattern) {
            if (!["?", source[i]].includes(pattern[i])) {
                return false;
            }
        }
        return true;
    }

    //分段处理多个*分割的内容
    //首个*前的开始部分
    let index = 0;
    let lastIndex = 0;

    for (index = 0; pattern[index] !== "*"; index++) {
        if (!["?", source[index]].includes(pattern[index])) {
            return false;
        }
    }

    lastIndex = index;

    //以*_____的格式拆分，分别处理最后一个之前的部分
    for (let starT = 0; starT < starCount - 1; starT++) {
        index++;
        //遍历时记录星号间内容格式
        let subPattern = "";
        while (pattern[index] !== "*") {
            subPattern += pattern[index];
            index++;
        }
        // 使用正则全局替换?为任意字符表达式（包括空白字符的情况）
        let reg = new RegExp(subPattern.replace(/\?/g, "[\\s\\S]"), "g");
        reg.lastIndex = lastIndex;
        if (!reg.exec(source)) {
            return false;
        }
        lastIndex = reg.lastIndex;
    }

    for (let j = 0; j <= source.length - lastIndex && pattern[pattern.length - j] !== "*"; j++) {
        if (![source[source.length - j], "?"].includes(pattern[pattern.length - j])) {
            return false;
        }
    }
    return true;

}