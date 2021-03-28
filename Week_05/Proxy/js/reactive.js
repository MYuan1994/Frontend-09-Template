//存储响应式操作的数据结构，暂时仅想到HASH表、WeakMap
let callbacks = new Map();
//为使对注册行为的"监听"可以深入到原始对象的内部（原始对象的props也可能是对象）
let reactivties = new Map();
//记录注册的行为发生的对象和属性的临时目录
let usedReactivties = [];


let effect = (callback) => {
    // 清空记录
    usedReactivties = [];
    //执行callback，若其引用了proxy中内容，会进入get函数，将对应的对象和属性信息记录进usedReactivties
    //---关键之处，(๑•̀ㅂ•́)و✧可以直接将所用到的对象和属性塞进usedReactivties中
    callback();
    for (let reactivity of usedReactivties) {
        // 防止重复注册，也为了将所有行为准确的注册到callbacks中
        // 如果callbacks中原来没有该对象，则创建一个新的该对象的map
        if (!callbacks.has(reactivity[0])) {
            callbacks.set(reactivity[0], new Map());
        }
        // 已有或者新建完对象后，判断是否注册过该对象的这个属性
        // 如果没有注册过该属性的行为，放一个空的队列预备后续加入新的callback
        // 另：数据结构可用list也可用map，具有哈希特性的map便于快速查找，但是因为行为列表顺序全执行，没有单独执行的需求，故无需使用map
        if (!callbacks.get(reactivity[0]).has(reactivity[1])) {
            callbacks.get(reactivity[0]).set(reactivity[1], []);
        }
        //万事俱备，将callback放入
        callbacks.get(reactivity[0]).get(reactivity[1]).push(callback);
    }

}

let reactive = (object) => {
    //判断是否绑定过
    if (reactivties.has(object)) {
        return reactivties.get(object);
    }
    let proxy = new Proxy(object, {
        set(obj, prop, val) {
            obj[prop] = val;

            if (callbacks.has(obj)) {
                if (callbacks.get(obj).has(prop)) {
                    for (let callbackT of callbacks.get(obj).get(prop)) {
                        callbackT();
                    }
                }
            }
            return obj[prop];
        },
        get(obj, prop) {
            //注册时调用callback自身，于此处添加
            usedReactivties.push([obj, prop]);
            if (typeof(obj[prop]) === "object") {
                return reactive(obj[prop]);
            }
            return obj[prop];
        }

    });

    reactivties.set(object, proxy);

    return proxy;
}

let objTest = {
    // name: "aaaaa",
    // age: 15,
    // experience: {
    //     primary: '小学',
    //     junior: '初中',
    //     high: '高中',
    //     university: '大学'
    // }
    r: 22,
    g: 22,
    b: 22,
    a: 10
}

let objProxy = reactive(objTest);

effect(() => {
    document.getElementById("R").value = objProxy.r;
    document.getElementById("G").value = objProxy.g;
    document.getElementById("B").value = objProxy.b;
    document.getElementById("opacity").value = objProxy.a;

    document.getElementById("displayDiv").style.background = `rgb(${objProxy.r},${objProxy.g},${objProxy.b},${objProxy.a/100})`;

})

document.getElementById("R").addEventListener("input", (ev) => {
    objProxy.r = ev.target.value;
})
document.getElementById("G").addEventListener("input", (ev) => {
    objProxy.g = ev.target.value;
})
document.getElementById("B").addEventListener("input", (ev) => {
    objProxy.b = ev.target.value;
})
document.getElementById("opacity").addEventListener("input", (ev) => {
    objProxy.a = ev.target.value;
})

document.getElementById("colorLine").addEventListener("input", (ev) => {

    switch (parseInt(ev.target.value / 256)) {
        case 0:
            objProxy.r = 255;
            objProxy.g = 0;
            objProxy.b = ev.target.value % 256;
            break;
        case 1:
            objProxy.r = 255 - ev.target.value % 256;
            objProxy.g = 0;
            objProxy.b = 255;
            break;
        case 2:
            objProxy.r = 0;
            objProxy.g = ev.target.value % 256;
            objProxy.b = 255;
            break;
        case 3:
            objProxy.r = 0;
            objProxy.g = 255;
            objProxy.b = 255 - ev.target.value % 256;
            break;
        case 4:
            objProxy.r = ev.target.value % 256;
            objProxy.g = 255;
            objProxy.b = 0;
            break;
        case 5:
            objProxy.r = 255;
            objProxy.g = 255 - ev.target.value % 256;
            objProxy.b = 0;
            break;
        case 6:
            objProxy.r = 255;
            objProxy.g = 0;
            objProxy.b = 0;
            break;
    }


})


effect(() => {
    // console.log(objProxy.experience.high);
})
effect(() => {
    // console.log(objProxy.experience.high);
})