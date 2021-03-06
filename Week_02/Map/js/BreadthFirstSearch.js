let BFS = () => {
    if (!start || !end) {
        alert("未完全设置好起点终点！");
        return;
    }
    clearFootPrint();
    let res = pathB(proxy, start, end);
    console.log(res);
};

async function pathB(data, start, end) {
    let table = Array(curWidth * curHeight).fill(0);
    var queue = [start];

    async function addQueue(x, y, prev) {
        if (x < 0 || y < 0 || x >= curWidth || y >= curHeight) {
            return;
        }

        if (data[curWidth * y + x] > 0) {
            return;
        }

        // await sleep(10);

        if (data[curWidth * y + x] === 0) {
            data[curWidth * y + x] = 2;
        }
        table[curWidth * y + x] = prev;
        queue.push(curWidth * y + x);
    }

    while (queue.length) {
        let num = queue.shift();
        let [x, y] = [num % curWidth, Math.floor(num / curWidth)];

        if (end === curWidth * y + x) {
            let realPath = [];
            let prev = curWidth * y + x;
            while (prev !== start) {
                realPath.push(prev);
                prev = table[prev];
                await sleep(30);
                data[prev] = 3;
            }
            data[start] = 4;

            return realPath;
        }

        let numT = curWidth * y + x;
        await addQueue(x, y + 1, numT);
        await addQueue(x, y - 1, numT);
        await addQueue(x + 1, y + 1, numT);
        await addQueue(x + 1, y - 1, numT);
        await addQueue(x - 1, y + 1, numT);
        await addQueue(x - 1, y - 1, numT);
        await addQueue(x + 1, y, numT);
        await addQueue(x - 1, y, numT);
    }

};


let sleep = (time) => {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    })
}