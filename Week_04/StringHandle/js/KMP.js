let sourceStr = "tyhfjrgaabaaacfdasdhqwedhdaaabaaacdfasd";
let patternStr = "aabaaac";

let BF = (Str1, Str2) => {
    let i = 0,
        j = 0;

    while (i < Str1.length && j < Str2.length) {
        if (Str1[i] === Str2[j]) {
            i++;
            j++;
        } else {
            i = i - j + 1;
            j = 0;
        }
    }
}

BF(sourceStr, patternStr);



let KMP = (source, pattern) => {
    let table = new Array(pattern.length).fill(0);

    let findList = [];

    {
        let i = 1,
            j = 0;
        while (i < pattern.length) {
            if (pattern[i] === pattern[j]) {
                //记录后一字符串不匹配时的回退位数
                // table[i + 1] = j + 1;//便于理解的写法
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
            if (pattern[j] === source[i]) {
                i++;
                j++;
            } else {
                if (j > 0) {
                    j = table[j];
                } else {
                    i++;
                }
            }
            //取决于pattern特征，字符串可能非独立，i须后移pattern.length
            if (j === pattern.length) {
                findList.push(i);
                j = 0;
            }
        }

        console.log(findList);
        return findList;
    }


}

KMP(sourceStr, patternStr);