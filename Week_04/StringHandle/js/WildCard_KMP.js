let windCardFind_KMP = (source, pattern) => {
    let starCount = 0;
    for (let i of pattern) {
        if (i === "*") {
            starCount++;
        }
    }
    if (starCount === 0) {
        for (let i in pattern) {
            if (!["?", source[i]].includes(pattern[i])) {
                return false;
            }
        }
        return true;
    }
    let index = 0;
    let lastIndex = 0;

    for (index = 0; pattern[index] !== "*"; index++) {
        if (!["?", source[index]].includes(pattern[index])) {
            return false;
        }
    }
    lastIndex = index;
    for (let starT = 0; starT < starCount - 1; starT++) {
        index++;
        let subPattern = "";
        while (pattern[index] !== "*") {
            subPattern += pattern[index];
            index++;
        }
        //相较正则修改处
        //传入截取后source与subPattern
        //返回false或index
        let source_KMP = source.slice(lastIndex);
        let result_KMP = KMP_W(source_KMP, subPattern);
        if (!result_KMP) {
            return false;
        } else {
            lastIndex = result_KMP;
        }
    }

    for (let j = 0; j <= source.length - lastIndex && pattern[pattern.length - j] !== "*"; j++) {
        if (![source[source.length - j], "?"].includes(pattern[pattern.length - j])) {
            return false;
        }
    }
    return true;

}



let KMP_W = (source, pattern) => {
    console.log("KMP");
    console.log(source);
    console.log(pattern);

    let table = new Array(pattern.length).fill(0);

    {
        let i = 1,
            j = 0;
        while (i < pattern.length) {
            //部分匹配表仅需修改此处，匹配?即可
            if (pattern[i] === pattern[j] || pattern[i] === "?") {
                i++;
                j++;
                table[i] = j;
            } else {
                if (j > 0) {
                    j = table[j];
                } else {
                    i++;
                }
            }

        }
    }

    {
        let i = 0,
            j = 0;
        while (i < source.length) {
            if (pattern[j] === source[i] || pattern[i] === "?") {
                i++;
                j++;
            } else {
                if (j > 0) {
                    j = table[j];
                } else {
                    i++;
                }
            }
            //因为需要尽可能短的匹配（防止占用多余空间影响下一段*___的匹配结果），所以查到即返回
            if (j === pattern.length) {
                return i;
            }
        }
        return false;
    }


}