class Sorted {
    constructor(data, compare) {
        this.data = data.slice();
        this.compare = compare || ((a, b) => a - b);
    }
    take() {
        if (!this.data.length) {
            return;
        }
        let min = this.data[0];
        let minIndex = 0;
        for (let index = 1; index < this.data.length; index++) {
            if (this.compare(this.data[index], min) < 0) {
                min = this.data[index];
                minIndex = index;
            }
        }
        this.data[minIndex] = this.data.slice(-1);
        this.data.pop();
        return min;
    }
    give(value) {
        this.data.push(value);
    }

};


let AStar = () => {
    if (!start || !end) {
        alert("未完全设置好起点终点！");
        return;
    }
    clearFootPrint();
    let res = pathA(proxy, start, end);
    console.log(res);
};

// f(n) = g(n) + h(n);
//g(n)已走距离，===》类似迪杰斯特拉算法->盲搜，慢到姥姥家了
//h(n)预估距离-启发函数===》类似最佳优先->无最佳结果但是快
//八向可走，使用对角距离
//另：四向可走：使用曼哈顿距离
async function pathA(data, start, end) {
    let footPrint = data.slice();
    let feetCount = Array(curWidth * curHeight).fill(1.7976931348623157E+10308);
    var queue = new Sorted([start], (a, b) => distance(a) - distance(b));

    feetCount[start] = 0;

    async function addQueue(x, y, prev, stepLength) {

        //碰墙、到达、回头
        if ([1, 3, 4].includes(data[curWidth * y + x])) {
            return;
        }
        if (x < 0 || y < 0 || x >= curWidth || y >= curHeight) {
            return;
        }
        //走的更多的就不用看了
        //如果走的更少则重新加入
        if (feetCount[curWidth * y + x] <= feetCount[prev] + stepLength) {
            return;
        }

        if (data[curWidth * y + x] === 0) {
            data[curWidth * y + x] = 2;
        }
        footPrint[curWidth * y + x] = prev;
        feetCount[curWidth * y + x] = feetCount[prev] + stepLength;
        queue.give(curWidth * y + x);

    }

    //已走距离+启发距离
    function distance(num) {
        //精确位数隐患---可能结果错误
        return feetCount[num] + Math.sqrt(((num % curWidth) - (end % curWidth)) ** 2 + (Math.floor(num / curWidth) - Math.floor(end / curWidth)) ** 2);
    }

    while (queue.data.length) {
        let num = queue.take();
        let [x, y] = [num % curWidth, Math.floor(num / curWidth)];

        if (end === curWidth * y + x) {
            let realPath = [];
            let prev = curWidth * y + x;
            while (prev !== start) {
                realPath.push(prev);
                prev = footPrint[prev];
                await sleep(3);
                data[prev] = 3;
            }
            data[start] = 4;

            return realPath;
        }

        await addQueue(x, y + 1, num, 1);
        await addQueue(x, y - 1, num, 1);
        await addQueue(x + 1, y + 1, num, Math.SQRT2);
        await addQueue(x + 1, y - 1, num, Math.SQRT2);
        await addQueue(x - 1, y + 1, num, Math.SQRT2);
        await addQueue(x - 1, y - 1, num, Math.SQRT2);
        await addQueue(x + 1, y, num, 1);
        await addQueue(x - 1, y, num, 1);
    }

};
