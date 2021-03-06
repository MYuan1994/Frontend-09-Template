let mapData;
let proxy;
let curWidth;
let curHeight;
let operType = 0;
let start;
let end;
let mapBox = document.getElementById("mapBox");


let initMap = (width, height) => {

    mapBox.innerHTML = "";
    start = undefined;
    end = undefined;
    for (let y = 0; y < height; y++) {
        let line = document.createElement("div");
        for (let x = 0; x < width; x++) {
            let spanBox = document.createElement("span");
            if (mapData[width * y + x] === 1) {
                spanBox.style.backgroundColor = "#666";
            } else {
                mapData[width * y + x] = 0;
            }
            spanBox.addEventListener("mousemove", () => {
                if (operType === 1) {
                    proxy[width * y + x] = 1;
                } else if (operType === 3) {
                    proxy[width * y + x] = 0;
                }
            });
            spanBox.addEventListener("dblclick", () => {
                if (proxy[width * y + x] !== 1) {
                    if (!start && (!end || end !== width * y + x)) {
                        proxy[width * y + x] = 4;
                        start = width * y + x;
                    } else if (!end && start !== width * y + x) {
                        proxy[width * y + x] = -5;
                        end = width * y + x;
                    } else if (start && start === width * y + x) {
                        proxy[width * y + x] = 0;
                        start = undefined;
                    } else if (end && end === width * y + x) {
                        proxy[width * y + x] = 0;
                        end = undefined;
                    }

                } else {
                    alert("起点/终点不可设置在墙体上！");
                }
            });
            line.append(spanBox);
        }
        mapBox.append(line);
    }
};


let bind = () => {
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
}

let clearFootPrint = () => {
    for (let index in proxy) {
        if (proxy[index] === 2 || proxy[index] === 3) {
            proxy[index] = 0;
        }
    }
}