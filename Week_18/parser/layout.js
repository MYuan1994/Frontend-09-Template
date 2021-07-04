function getStyle(element) {
    if (!element.style) {
        element.style = {};
    }
    for (let prop in element.computedStyle){
        var p = element.computedStyle.value;
        element.style[prop] = element.computedStyle[prop].value;

        if (element.style[prop].toString().match(/px$/)) {
            element.style[prop]=parseInt(element.style[prop])
        }
        if (element.style[prop].toString().match(/^[0-9/.]+$/)) {
            element.style[prop]=parseInt(element.style[prop])
        }
    }
    return element.style;
}

function layout(element) {
    if (!element.computedStyle) {
        return;
    }
    var elementStyle = getStyle(element);
    if (elementStyle.display!=="flex") {
        return;
    }
    var items = element.children.filter(e =>e.type==='element')
    items.sort(function (a, b) {
        return (a.order || 0) - (b.order || 0);
    });
    //容器属性
    var style = elementStyle;
    ['width', 'height'].forEach(size => { 
        if (style[size]==='auto'||style[size]==='') {
            style[size] = null;
        }
    })

    //容器属性设置初始值
    if (!style.flexDirection||style.flexDirection==='auto') {
        style.flexDirection = 'row';
    }
    if (!style.alignItems||style.alignItems==='auto') {
        style.alignItems = 'stretch';
    }
    if (!style.justifyContent||style.justifyContent==='auto') {
        style.justifyContent = 'flex-start';
    }
    if (!style.flexWrap||style.flexWrap==='auto') {
        style.flexWrap = 'nowrap';
    }
    if (!style.alignContent||style.alignContent==='auto') {
        style.alignContent = 'stretch';
    }

    /**将普通样式属性抽象成主轴交叉轴的属性
     * 主轴/交叉轴的尺寸代替的属性、起始位置代替的属性、结束位置代替的属性、方向，起始值计算值
    */
    var mainSize, mainStart, mainEnd, mainSign, mainBase,
        crossSize, crossStart, crossEnd, crossSign, crossBase
    
    if (style.flexDirection === 'row') {
        mainSize = 'width';
        mainStart = 'left';
        mainEnd = 'right';
        mainSign = +1;
        mainBase = 0;
        
        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }else if (style.flexDirection === 'row-reverse') {
        mainSize = 'width';
        mainStart = 'right';
        mainEnd = 'left';
        mainSign = -1;
        mainBase = style.width;
        
        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }else if (style.flexDirection === 'column') {
        mainSize = 'height';
        mainStart = 'top';
        mainEnd = 'bottom';
        mainSign = +1;
        mainBase = 0;
        
        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }else if (style.flexDirection === 'column-reverse') {
        mainSize = 'height';
        mainStart = 'bottom';
        mainEnd = 'top';
        mainSign = -1;
        mainBase = style.height;
        
        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }
    // 对flexWrap值为wrap-reverse特殊处理
    if (style.flexWrap === 'wrap-reverse') {
        // a = [b,b=a][0]
        [crossStart, crossEnd] = [crossEnd, crossStart];
        crossSign = -1;
    } else {
        crossBase = 0;
        crossSign = 1;
    }

    //分行



    var isAutoMainSize = false;
    // 当主轴尺寸未设定
    if (!style[mainSize]) {
        elementStyle[mainSize] = 0;
        for (var i = 0; i < items.length;i++){
            var item = items[i];
            if (item.style[mainSize] !== null || item.style[mainSize]!==(void 0)) {
                elementStyle[mainSize] = elementStyle[mainSize] + item.style[mainSize];
            }
        }
        isAutoMainSize = true;
    }

    var flexLine = [];
    var flexLines = [flexLine];

    // 预设主轴交叉轴尺寸
    var mainSpace = elementStyle[mainSize];
    var crossSpace = 0;

    for (var i = 0; i < items.length; i++){
        var item = items[i];
        var itemStyle = getStyle(item);

        if (itemStyle[mainSize]===null) {
            itemStyle[mainSize] = 0;
        }

        /**三种情况：
         * 1.如果项目带有flex属性，直接加进去
         * 2.如果主轴未设置尺寸且轴线的换行属性设置为nowrap,则重新计算主轴和交叉轴尺寸后将项目放入当前行
         * 3.其余情况为项目内可换行，依据主轴尺寸和项目在主轴方向的长度：
         *   若项目大于主轴长度，则缩小项目主轴向长度
         *   若容器当前行剩余主轴空间小于项目主轴向长度，则换行(重置flexLine、两轴尺寸)并记录主轴交叉轴尺寸
         */
        if (itemStyle.flex) {
            flexLine.push(item)
        } else if (style.flexWrap === "nowrap" && isAutoMainSize) {
            mainSpace -= itemStyle[mainSize];
            if (itemStyle[crossSize]!==null&&itemStyle[crossSize]!==(void 0)) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
            }
            flexLine.push(item);
        } else {
            if (itemStyle[mainSize]>style[mainSize]) {
                itemStyle[mainSize] = style[mainSize];
            }
            if (mainSpace < itemStyle[mainSize]) {
                flexLine.mainSpace = mainSpace;
                flexLine.crossSpace = crossSpace;
                flexLine = [item];
                flexLines.push(flexLine);
                mainSpace = style[mainSize];
                crossSpace = 0;
            } else {
                flexLine.push(item);
            }
            // 提取出条件分支下公共部分
            mainSpace -= itemStyle[mainSize];
            if (itemStyle[crossSize]!==null&&itemStyle[crossSize]!==(void 0)) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
            }
        }
    }

    flexLine.mainSpace = mainSpace;

    if (style.flexWrap === "nowrap" || isAutoMainSize) {
        flexLine.crossSpace = style[crossSize] !== (void 0) ? style[crossSize] : crossSpace;
    } else {
        flexLine.crossSpace = crossSpace;
    }

    if (mainSpace < 0) {
        var scale = style[mainSize] / (style[mainSize] - mainSpace);
        // 当前主轴已排布位置
        var currentMain = mainBase;
        for (var i = 0; i < items.length;i++){
            var item = items[i];
            var itemStyle = getStyle(item);

            if (itemStyle.flex) {
                itemStyle[mainSize] = 0;
            }

            itemStyle[mainSize] = itemStyle[mainSize] * scale;

            itemStyle[mainStart] = currentMain; 
            itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
            currentMain = itemStyle[mainEnd];
        }
    } else {
        flexLines.forEach((items) => {
            var mainSpace = items.mainSpace;
            var flexTotal = 0;
            for (var i = 0; i < items.length;i++){
                var item = items[i];
                var itemStyle = getStyle(item);

                if (itemStyle.flex !== null && itemStyle.flex !== (void 0)) {
                    flexTotal += itemStyle.flex;
                    continue;
                }
            }
            if (flexTotal>0) {
                var currentMain = mainBase;
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    var itemStyle = getStyle(item);

                    if (itemStyle.flex) {
                        itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex;
                    }
                    itemStyle[mainStart] = currentMain; 
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd];
                }
            } else {
                // 在没有作为flex容器的项目时，依据主轴上的对齐方式
                if (style.justifyContent==='flex-start') {
                    var currentMain = mainBase;
                    var step = 0;
                }else if (style.justifyContent==='flex-end') {
                    var currentMain = mainSpace * mainSign + mainBase;
                    var step = 0;
                }else if (style.justifyContent==='center') {
                    var currentMain = mainSpace/2 * mainSign + mainBase;
                    var step = 0;
                }else if (style.justifyContent==='space-between') {
                    var step = mainSpace / (items.length - 1) * mainSign;
                    var currentMain = mainBase;
                }else if (style.justifyContent === 'space-around') {
                    //前后各一半间隔正好凑整
                    var step = mainSpace / items.length * mainSign;
                    var currentMain = step / 2 + mainBase;
                }
                for (var i = 0; i < items.length;i++){
                    var item = items[i];
                    itemStyle[mainStart,currentMain]; 
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd] + step;
                    
                }
            }


        })
    }

    var crossSpace;
    // 交叉轴尺寸未设定，则初始化后累计所有行高撑开高度；否则
    if (!style[crossSize]) {
        crossSpace = 0;
        elementStyle[crossSize] = 0;
        for (var i = 0; i < flexLines.length;i++){
            elementStyle[crossSize] = elementStyle[crossSize] + flexLines[i].crossSpace;
        }
    } else {
        crossSpace = style[crossSize];
        for (var i = 0; i < flexLines.length;i++){
            crossSpace -= flexLines[i].crossSpace;
        }
    }

    // 如果换行方式是与交叉轴反向的添加行，则交叉轴初值取crossSize，即从后到前计算
    if (style.flexWrap==='wrap-reverse') {
        crossBase = style[crossSize];
    } else {
        crossBase = 0;
    }

    var step;
    // var lineSize = style[crossSize] / flexLines.length;

    /** 依据多轴线排列方式设置，轴线只有一根时应当不起作用
     *  1.对齐交叉轴起点
     *  2.对齐终点
     *  3.对齐中点
     *  4.两端对齐
     *  5.间隔一致对齐
     * *6.全充满，填充剩余空间
    */
    if (style.alignContent==='flex-start') {
        crossBase += 0;
        step = 0;
    } else if (style.alignContent==='flex-end') {
        crossBase += crossSign * crossSpace;
        step = 0;
    } else if (style.alignContent==='center') {
        crossBase += crossSign + crossSpace / 2;
        step = 0;
    } else if (style.alignContent==='space-between') {
        crossBase += 0;
        step = crossSpace / (flexLines.length - 1);
    } else if (style.alignContent === 'space-around') {
        step = crossSpace / flexLines.length;
        crossBase += crossSign * step / 2;
    } else if (style.alignContent==='stretch') {
        crossBase += 0;
        step = 0;
    }

    flexLines.forEach((items) => {
        var lineCrossSize = style.alignContent === 'stretch' ? items.crossSpace + crossSpace / flexLines.length : items.crossSpace;
        for (var i = 0; i < items.length;i++){
            var item = items[i];
            var itemStyle = getStyle(item);

            //若项目有单独的的不继承父元素的对齐方式，则使用该对齐方式，否则继承容器交叉轴对齐方式
            var align = itemStyle.alignSelf || style.alignItems;
            if (itemStyle[crossSize]===null) {
                itemStyle[crossSize] = align === 'stretch' ? lineCrossSize : 0;
            }
            /** 分条件处理项目的align
             * 取值范围应有：auto | flex-start | flex-end | center | baseline | stretch
            */
            if (align === 'flex-start') {
                itemStyle[crossStart] = crossBase;
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
            } else if (align === 'flex-end') {
                itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize;
                itemStyle[crossStart] = itemStyle[crossEnd] - crossSign * itemStyle[crossSize];
            }else if (align === 'center') {
                itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize]) / 2;
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
            }else if (align === 'stretch') {
                itemStyle[crossStart] = crossBase;
                itemStyle[crossEnd] = crossBase + crossSign * (itemStyle[crossSize]!==null&&itemStyle[crossSize]!==(void 0)?itemStyle[crossSize]:lineCrossSize);
                itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart]);
            }

        }

        crossBase += crossSign * (lineCrossSize + step);
    });
    // console.log(items);

}

module.exports = { layout };