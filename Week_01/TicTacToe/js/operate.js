let initCheckerBoard = () => {
    player = 1;
    state = "init";

    let latticeList = document.getElementsByTagName("span");
    for (let index = 0; index < latticeList.length; index++) {
        latticeList[index].addEventListener("click", () => {
            if (proxy[index] == 0) {
                proxy[index] = player;

                if (checkRes(index, proxy)) {
                    if (player === 1) {
                        changeState("win");
                    } else {
                        changeState("lose");
                    }
                }
                //str不含有0 !proxy.join(proxy).match(0)
                //相乘等于0
                else if (proxy.reduce((x, y) => { return x * y; }, 1) !== 0) {
                    changeState("tie");
                }

                player = 2 / player;

                AIOperate();
            }
        })
    }

}

let checkRes = (index, proxy) => {

    let i = Math.floor(index / 3);
    let j = (index % 3);

    if (proxy[3 * i] === proxy[3 * i + 1] && proxy[3 * i] === proxy[3 * i + 2]) {
        return true;
    } else if (proxy[j] === proxy[j + 3] && proxy[j] === proxy[j + 6]) {
        return true;
    } else if (i === j && proxy[0] === proxy[4] && proxy[0] === proxy[8]) {
        return true;
    } else if (i + j === 2 && proxy[2] === proxy[4] && proxy[2] === proxy[6]) {
        return true;
    }

    return false;
}


let changeState = (stateT) => {
    state = stateT;
    document.documentElement.style.setProperty('--state', `var(--${stateT}`);
}

let reset = () => {
    changeState("init");
    for (index in proxy) {
        proxy[index] = 0;
    }
    player = 1;
}

let willWin = (board, player) => {
    for (let index in board) {
        if (board[index] === 0) {
            //浅复制
            //1.新建对象，循环添加
            //2.类型转换：jsonStr与json、join与split
            //3....扩展语法
            //4.assign
            //5.copyWithin

            //6.新get：Object.creat()
            let tempBoard = [...board];
            tempBoard[index] = player;
            if (checkRes(index, tempBoard)) {
                return index;
            }
        }

    }
    return null;
}

let bestChoice = (board, player) => {
    //如果直接导致胜利，返回结果
    if (willWin(board, player)) {
        return {
            choice: willWin(board, player),
            result: 1
        }
    }

    let result = -2;
    let choice = null;
    for (let index in board) {

        if (board[index] === 0) {
            let tempBoard = [...board];
            tempBoard[index] = player;
            let resultT = bestChoice(tempBoard, 2 / player).result;
            if (-resultT > result) {
                result = -resultT;
                choice = index;
            }
            if (result === 1) {
                break;
            }
        }
    }
    return {
        choice: choice,
        result: choice ? result : 0
    }
}


let AIOperate = () => {

    let AIchoice = bestChoice(proxy, player).choice;

    proxy[AIchoice] = player;

    if (checkRes(AIchoice, proxy)) {
        if (player === 1) {
            changeState("win");
        } else {
            changeState("lose");
        }
    } else if (!proxy.join(proxy).match(0)) {
        changeState("tie");
    }

    player = 2 / player;

}