# 第二周

## 1.搜索算法整理

------------------------------

### 1）广度优先BFS（盲目搜索、无最佳路线）

往周围所有可以走的点发散：

1.将周围点加入队列，并记录本点为队列中点的前驱点，已经过的点不进入队列；

2.判断是否队列中是否有终点，有则跳出循环；否则持续遍历直到碰墙或超出边界。

若找到终点，则依据记录前驱点的数据依次找到回去的点。

### 2）贪婪最佳优先GBFS（速度快、无最佳路线）

方法1的盲搜的方式搜索了过多的无用点，在BFS基础上，每步进行到达终点的剩余成本估计（计算剩余距离），减少无用的搜索，在需要最快得到路线而对路线无要求时可以使用。

### 3）Dijkstra（盲目搜索）

方法1在遍历队列的时候，已经过的点没有再次进行检查，因此记录前驱点的数据队列里不一定是最佳原始点的选择，故需要进行到达该点所需成本的记录，同样以BFS为基础，初始化一个数据队列记录已有步数，初始化start的点步数为0，遍历队列时，累加步数（不同方向距离不同计算），并已经经过的点也进行检查，当当前累计步数低于原有记录步数时，更新步数和前驱点记录。

### 4）AStar（有最佳路线）

结合了2、3的改进，实现f(n)=g(n)+h(n)；

在完成模型进行展示时，发现计算估计距离的h(n)越小，就需要遍历更多的节点，不知此处是否可以改进。留于后续。
### 另：步数距离

如果图形中只允许朝上下左右四个方向移动，使用曼哈顿距离；如果图形中允许朝八个方向移动，使用对角距离；如果图形中允许朝任何方向移动，使用欧几里得距离。

## 2.数据结构

--------------------------

### HEAP

最大堆/最小堆：主要区别于数据添加到HEAP的时候进行的操作，若需要最小堆，则根节点为最小值，添加节点需要对其进行下沉操作，使添加的节点添加到合适位置；若使用最大堆，则将节点上浮；

```javascript
//下沉
siftDown(index, value) {
        this.data[index] = value;
        while (index > 0 && this.compare(value, this.data[Math.floor((index - 1) / 2)]) < 0) {
            this.data[index] = this.data[Math.floor((index - 1) / 2)];
            this.data[Math.floor((index - 1) / 2)] = value;
            index = Math.floor((index - 1) / 2);
        }

    };
//上浮
siftUp(index, value) {
        this.data[index] = value;
        while (index > 0 && this.compare(v, this.data[Math.floor((index - 1) / 2)]) > 0) {
            this.data[index] = this.data[Math.floor((index - 1) / 2)];
            this.data[Math.floor((index - 1) / 2)] = value;
            index = Math.floor((index - 1) / 2);
        }

    }
```

另：须注意左右叶子节点边界情况。

## 3.非课程内容使用

-------------------------------

### proxy

同上周，使用VUE3.0实现数据双向绑定的方式proxy来实现地图点状态和data的值的绑定，为使操作地图时可以更专注于数据的处理。

```javascript
proxy = new Proxy(mapData, {
        set: function(target, key, value, receiver) {
            //0:空
            /**
             * 0：空
             * 1：墙
             * 2：足迹
             * 3：路径
             * 4：起点
             * -5：终点
             * 
             * */
            switch (value) {
                case 0:
                    document.getElementsByTagName("span")[key].style.backgroundColor = "";
                    break;
                case 1:
                    document.getElementsByTagName("span")[key].style.backgroundColor = "#666";
                    break;
                case 2:
                    document.getElementsByTagName("span")[key].style.backgroundColor = "#24dfcf8e";
                    break;
                case 3:
                    document.getElementsByTagName("span")[key].style.backgroundColor = "#e70f0f";
                    break;
                case 4:
                    document.getElementsByTagName("span")[key].style.backgroundColor = "#13a2df";
                    break;
                case -5:
                    document.getElementsByTagName("span")[key].style.backgroundColor = "#0fe77b";
                    break;
            }
            target[key] = value;
            return true;
        },
        get: function(target, key, receiver) {
            return target[key];
        }
    });
```

### onbeforeunload

未添加手动保存方法，添加window.onbeforeunload监听，在离开页面或者刷新页面时进行记录，防止误触丢失当前进度；

### NODE模块保存地图

本地搭建node工程,使用fs读写json文件记录mapData，工程未提交，所使用简写代码如下：

搭建：

```javascript
const http = require('http');
const app = http.createServer();
const url = require('url')
const path = require('path')
const fs = require('fs')

app.on('request', (req, res) => {
    var pathName = url.parse(req.url).pathname;
    var realPath = path.join(__dirname, pathName);

    fs.readFile(realPath, (error, result) => {
        res.end(result)
    })

})
app.listen(3000);
console.log('ZZZZZZZZZZZZZZZZZZZZZMY');
```

读取：

```javascript
function initJson(url) {
        var request = new XMLHttpRequest();
        request.open("get", url);
        request.send(null);
        request.onload = function() {
            if (request.status == 200) {
                var MapData = JSON.parse(request.responseText);
                //转化mapData……
                ……
            }
        }
    }
```

