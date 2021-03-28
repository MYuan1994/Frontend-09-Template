let dragBox = document.getElementById("dragBox");

// let baseX = dragBox.offsetLeft + dragBox.style.width / 2,
//     baseY = dragBox.offsetTop + dragBox.style.height / 2;
let baseX = 0,
    baseY = 0;
dragBox.addEventListener("mousedown", (event) => {
    let startX = event.clientX,
        startY = event.clientY;

    let up = (event) => {

        baseX = baseX + event.clientX - startX;
        baseY = baseY + event.clientY - startY;
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", up);
    };
    let move = (event) => {
        let range = getNearest(event.clientX, event.clientY);
        range.insertNode(dragBox);
        // dragBox.style.transform = `translate(${baseX + event.clientX - startX}px,${baseY + event.clientY - startY}px)`;
        range.detach();
    }
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
})

let ranges = [];
let container = document.getElementById("container");
for (let i = 0; i < container.childNodes[0].textContent.length; i++) {
    // 创建range并设置起点终点
    let range = document.createRange();
    range.setStart(container.childNodes[0], i);
    range.setEnd(container.childNodes[0], i);

    // 获取页面元素的位置（相对于可见窗口）及大小信息,可以取得到left top right bottom x y width以及height
    console.log(range.getBoundingClientRect());
    ranges.push(range);
}

let getNearest = (x, y) => {
    let min = Infinity;
    let nearest = null;
    for (let range of ranges) {
        let rect = range.getBoundingClientRect();
        let distance = (rect.x - x) ** 2 + (rect.y - y) ** 2;
        if (distance < min) {
            nearest = range;
            min = distance;
        }
    }
    return nearest;
}