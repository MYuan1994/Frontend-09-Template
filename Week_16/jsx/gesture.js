// 分为三部分：监听、识别、分发

// let element = document.documentElement;






// export function dispatch(type, properties) {
//     // 或者CustomEvent
//     let event = new Event(type);
//     for (let name in properties){
//         event[name] = properties[name];
//     }
//     element.dispatchEvent(event);
// }

// new Listener(new Recognizer(new Dispatcher或者dispatch))
export class Listener{
    constructor(element,recognizer) {
        let isListeningMouse = false;

        let contexts = new Map();

        element.addEventListener("mousedown", event => {
            
            let context = Object.create(null);
            contexts.set("mouse" + (1 << event.button), context);
            recognizer.start(event,context);
            let mousemove = event => {
                // event.buttons使用掩码表示按键情况
                let button = 1;
                while (button <= event.buttons) {
                    if (button & event.buttons) {
                        let key;
                        //处理button与buttons中鼠标中键右键key相反的情况
                        if (button===2) {
                            key = 4;
                        }else if (button===4) {
                            key = 2;
                        } else {
                            key = button;
                        }
                        let context = contexts.get("mouse" + key);
                        recognizer.move(event, context);
                    }
                    button = button << 1;
                }
            }

            let mouseup = event => {
                let context = contexts.get("mouse" + (1 << event.button));
                recognizer.end(event, context);
                contexts.delete("mouse" + (1 << event.button));

                //无按键则移除
                if (event.buttons === 0) {
                    document.removeEventListener("mousemove", mousemove);
                    document.removeEventListener("mouseup", mouseup);
                    isListeningMouse = false;
                }
            }
            if (!isListeningMouse) {
                document.addEventListener("mousemove", mousemove);
                document.addEventListener("mouseup", mouseup);
                isListeningMouse = true;
            }
            
        });

        element.addEventListener("touchstart", event => {
            for (let touch of event.changedTouches) {
                let context = Object.create(null);
                contexts.set(touch.identifier,context)
                recognizer.start(touch,context)
            }
        });
        
        element.addEventListener("touchmove", event => {
            for (let touch of event.changedTouches) {
                let context = contexts.get(touch.identifier);
                recognizer.move(touch,context)
            }
        });
        
        element.addEventListener("touchend", event => {
            for (let touch of event.changedTouches) {
                let context = contexts.get(touch.identifier);
                recognizer.end(touch, context);
                contexts.delete(touch.identifier);
            }
        });
        
        element.addEventListener("touchcancel", event => {
            for (let touch of event.changedTouches) {
                let context = contexts.get(touch.identifier);
                recognizer.cancel(touch,context);
                contexts.delete(touch.identifier);
            }
        });
    }
}
// 识别器
export class Recognizer{
    constructor(dispatcher) { this.dispatcher = dispatcher;}
    start(point, context) {
        context.startX = point.clientX, context.startY = point.clientY;

        this.dispatcher.dispatch("start", {
            clientX: point.clientX,
            clientY: point.clientY
        });
        
        context.points = [{
            t: Date.now(),
            x: point.clientX,
            y: point.clientY
        }];
    
        context.isTap = true;
        context.isPan = false;
        context.isPress = false;
        
        context.handler = setTimeout(() => {
            context.isTap = false;
            context.isPan = false;
            context.isPress = true;
            context.handler = null;
            this.dispatcher.dispatch("press",{});
        },500)
    };
        
    move(point, context) {
        let dx = point.clientX - context.startX, dy = point.clientY - context.startY;

        if (!context.isPan && dx ** 2 + dy ** 2 > 100) {
            context.isPan = true;
            context.isTap = false;
            context.isPress = false;
            context.isVertical = Math.abs(dx) < Math.abs(dy);
            this.dispatcher.dispatch("panStart", {
                startX:context.startX,
                startY:context.startY,
                clientX:point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical
            });
            clearTimeout(context.handler);
        }
        if (context.isPan) {
            this.dispatcher.dispatch("pan", {
                startX:context.startX,
                startY:context.startY,
                clientX:point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical
            });
        }

        context.points=context.points.filter(point=>Date.now()-point.t<500)

        context.points.push({
            t: Date.now(),
            x: point.clientX,
            y: point.clientY
        })
        
    };

    end(point,context){
        if (context.isTap) {
            this.dispatcher.dispatch("tap",{})
            clearTimeout(context.handler);
        }
        
        if (context.isPress) {
            this.dispatcher.dispatch("pressend",{})
        }
    
        context.points=context.points.filter(point=>Date.now()-point.t<500)
        
        let d, v;
        if (!context.points.length) {
            v = 0;
        } else {
            d = Math.sqrt((point.clientX - context.points[0].x)**2+(point.clientY - context.points[0].y)**2);
            v = d / (Date.now() - context.points[0].t);
        }
    
        
    
        if (v>1.5) {
            this.dispatcher.dispatch("flick", {
                startX:context.startX,
                startY:context.startY,
                clientX:point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical,
                isFlick: context.isFlick,
                velocity:v
            });
            context.isFlick = true;
        } else {
            context.isFlick = false;
        }
        if (context.isPan) {
            this.dispatcher.dispatch("panend", {
                startX:context.startX,
                startY:context.startY,
                clientX:point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical,
                isFlick: context.isFlick,
                velocity:v
            });
        }
        this.dispatcher.dispatch("end", {
            startX:context.startX,
            startY:context.startY,
            clientX:point.clientX,
            clientY: point.clientY,
            isVertical: context.isVertical,
            isFlick: context.isFlick,
            velocity:v
        });
    };
    cancel(point,context){
        clearTimeout(context.handler);
        this.dispatcher.dispatch("cancel", {});
    }
}

export class Dispatcher{
    constructor(element){
        this.element = element;
    }
    dispatch(type, properties) {
        let event = new Event(type);
        for (let name in properties) {
            event[name] = properties[name];
        }
    
        this.element.dispatchEvent(event)
    }
}

export function enableGesture(element) {
    new Listener(element,new Recognizer(new Dispatcher(element)))
}