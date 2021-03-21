// 声明结束符号
let count = Symbol("count");

class Trie {
    constructor() {
        //构造函数中创建root节点
        this.root = Object.create(null);
    }

    insert(word) {
        //初始化node为根节点
        let node = this.root;
        //遍历传入单词的字符
        for (let c of word) {
            //如果未传入过该字字符，则新建该字符节点
            if (!node[c]) {
                node[c] = Object.create(null);
            }
            //将该字符节点作为临时节点继续遍历
            node = node[c];
        }
        // 如果该节点未标记过结束符号（设置过count属性值）使用[]操作符设置count属性值为0
        if (!(count in node)) {
            node[count] = 0;
        }
        //每次遍历单词完成后修改属性值count以记录单词数
        node[count]++;
    }


    findMost() {
        let mostList = [];
        let most = { num: 0, word: null };
        let visit = (node, word) => {
            if (node[count] && node[count] > most.num) {
                mostList.length = 0;
                most = {
                    num: node[count],
                    word: word
                }
                mostList = [...mostList, most];
            } else if (node[count] && node[count] === most.num) {
                mostList = [...mostList, { num: node[count], word: word }];
            }
            for (let child in node) {
                visit(node[child], word + child)
            }
        }

        visit(this.root, "");
        console.log(mostList);
    }

    associate(keywords) {
        let possibilityList = [];
        let visit = (node, word) => {
            if (node[count] && word.search(keywords) !== -1 && word !== keywords) {

                console.log(node[count] + "-----" + word);
                let aimIndex = 0;
                if (possibilityList.length > 0) {
                    for (let index in possibilityList) {
                        if (node[count] < possibilityList[index].num) {
                            aimIndex = index + 1;
                        }
                    }
                }
                possibilityList.splice(aimIndex, 0, { num: node[count], word: word });

                //超出预设长度，去掉最后的一项
                if (possibilityList.length > 10) {
                    possibilityList.pop();
                }

            }
            for (let child in node) {
                visit(node[child], word + child)
            }
        }
        visit(this.root, "");
        console.log(possibilityList);
        return possibilityList;
    }

}

let creatWord = (length) => {
    let wordTemp = "";
    for (let i = 0; i < length; i++) {
        //拼接依据unionCode值区间使用formChartCode生成随机小写字母
        wordTemp += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
    }
    return wordTemp;
}

let trie = new Trie();

for (let i = 0; i < 10000; i++) {
    trie.insert(creatWord(Math.floor(Math.random() * 3) + 3));
}
// console.log(trie);
trie.findMost();