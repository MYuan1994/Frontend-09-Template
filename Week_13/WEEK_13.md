# 第十三周

## 课堂笔记

### HTML定义

#### XML与SGML

**SGML**：标准通用置标语言，上世纪60年代

**XML**：由SGML的子集改良得到

`HTML`完全使用SGML子集的定义方式，故其有符合SGML的DTD，后来经W3C的XML化的尝试，产生了XHTML版本，XHTML2因为语法限制过于严格遭到社区反对而流产。

HTML5中重新定义了HTML与XML、SGML的关系，不再认为HTML为SGML的子集

#### DTD与XML namespace

- XHTML1 DTD：http://www.w3.org/TR/xhtml/DTD/xhtml1-srtict.dtd
- XML namespace：http://www.w3.org/1999/xhtml

DTD是SGML中定义子集的文档格式，任何人不可在实现网页时访问DTD。

XHTML1.0对应HTML的4.2左右，是HTML4的严格模式。

DTD的三个主要Entry：

1. lating

   主要关注`&nbsp;`，定义为no-break space，连接两词，而非空格。HTML中实现空格应使用css的white-space将空格显示出来。

2. symbol

   符号类，形为`&lambda;`表示&lambda;

3. special

   需转义类符号，常用：

   - quot：双引号
   - amp：&
   - lt：小于号
   - gt：大于号

XML namespace：

三个常用`mathml`、`svg`、`XHTML`

### HTML语法

合法元素写法：

1. Element：\<tagName>……\</tagName>

2. Text

3. comment：注释\<!-- comments-->

4. DocumentType：H5中仅此一个<!Doctype html>

5. ProcessingInstruction：预处理语法，写作\<?a 1?>，意为把传给a这个processor

6. CDATA：\<![CDATA[ ]]>

   CDATA节点：特殊语法，产生的也是文本节点

   CDATA中节点无需担心转义问题，此规定由XML继承而来

### 浏览器API

#### DOM节点家族

- NODE

  - Element：元素节点类型，与标签对应

    - HTMLElement
      - HTMLAnchorElement
      - HTMLAppleElement
      - HTMLAreaElement
      - ……
    - SVGElement
      - SVGAElement
      - SVGAltalyphElement
      - ……

  - Document：文档根节点

  - CharacterData：字符数据

    - Text：文本节点
      - CDATASection：CDATA节点
      - ……
    - comment：注释
    - ProcessingInstruction：处理信息（实际不应出现在HTML中）

  - DocumentFragment：文档片段

    不挂在DOM树上，但可以执行挂在DOM上的操作，会将片段的子节点挂上去，一般与range API配合使用

  - DocumentType：文档类型

#### DOM API

分类

1. traversal系列：可以访问DOM树所有节点的一个自动迭代的工具，现状是几乎淘汰，不建议使用
2. 节点部分
3. 事件部分
4. range部分：比节点部分性能更好、更精确，但易用性较差

##### 节点API

###### 导航类API

`节点导航`：包含空文本节点

- parentNode
- childNode
- firstChild
- lastChild
- nextSibling
- previousSibling

`元素导航`：仅找元素

- parentElement（实际与parentNode完全一样）
- children
- firstElementChild
- lastElementChild
- nextElementSibling
- previousElementSibling

###### 修改类API

- appendChild
- insertBefore：与appendChild为一组API，覆盖所有插入范围，insertBefore占所有元素前，appendChild占最后，遵循最小化API原则
- removeChild：移除，必须在元素的parent上进行
- replaceChild

###### 高级操作

- compareDocumentPosition：用于比较两个节点（前后）关系的函数
- contains：检查一个节点是否包含另一个节点
- isEqualNode：检查两个节点（在DOM树的结构）是否完全相同，无序列化检查树形结构
- isSameNode：检查两节点是否是同一节点，js中可使用“===”代替，API设计出于多语言适配的考虑
- cloneNode：复制一个节点，若传入参数为true，会连带子元素做深拷贝，`做HTML模板时可用`，速度优秀

##### 事件API

了解事件对象模型：

addEventListener：可用于所有节点，写法：

```javascript
target.addEventListener(type, listener [, options]);
```

第三参数取值可能：

1. true/false：capture，控制冒泡模式或捕获模式
2. options：可选
   - capture：控制冒泡/捕获
   - once：判断是否只响应一次
   - passive：是否是不带有副作用的事件，可用于单纯的监听事件不做处理的场景，高频次事件传入时可明显提高性能。

Event的`冒泡`与`捕获`：

与监听无关，在事件触发时，冒泡与捕获都会发生，不管该事件是否被监听；任何事件都是先捕获再冒泡，捕获时还未知悉作用的具体元素，冒泡时已确定具体元素。

#### Range API

**用途**：DOM API的节点部分可以操作单个节点，当需要操作半个节点或者批量操作节点时，需使用Range API：

特征：性能优异、操作精确；使用难度大、难理解

**用法**：

1. 创建Range：

   每个range一定连续；range使用无需考虑层级关系

   - 元素+偏移

     ```javascript
     var range=new Range();
     range.setStart(element,4);
     range.setEnd(element2,5);
     ```

   - Selection鼠标圈中

     ```javascript
     //鼠标圈中
     var range=document.getSelection().getRangeAt(0);
     ```

   - 其他方式
     - range.setStartBefore
     - range.setEndBefore
     - range.setStartAfter
     - range.setEndAfter
     - range.selectNode：选中元素
     - range.selectNodeContents：选中元素内容

2. 操作Range：

   取出/添加：

   ```javascript
   var fragment=range,extractContents();
   range.insertNode(document.creatTextNode("XXXX"));
   ```

   将片段取出加到DOM树中，append时，自身不会append到dom上，而是将自身所有子节点添加到DOM上，片段也可以执行DOM上的API。

#### CSSOM API

通过document.styleSheets访问

获取css的方法：style和link

styleSheets对象的子集：

###### rules

一个styleSheets对应一个style或者style的link标签，每个里面以数组的形式存有rule

- document.styleSheets[0].cssRules
- document.styleSheets[0].insertRule("一段rules"，位置)
- document.styleSheets[0]。removeRule（0）

###### getComputedStyle

计算后的样式

- window.getComputedStyle(element,pseudoElt);

  element：想要获取的元素

  pseudoElt：可选，伪元素

用处：

1. 获取元素的transform
2. 拖拽行为
3. css动画中动态判断

#### CSSOM View API

与CSS语言模型不一致，与浏览器最终视图相关。

window API：

- window.innerHeight,window.innerWidth：渲染区域viewport的高度宽度
- window.outerHeight,window.outerWidth：渲染区域viewport加上工具栏的高度宽度
- `window.devicePixelRatio`：屏幕物理像素与代码逻辑像素的比值，DPR于不同设备取值不同，会影响原有逻辑尺寸的展现。
- window.screen：屏幕的尺寸
  - width,height：实现宽高
  - availWidth，availHeight：可使用部分的宽高
- window.open("","","宽、高、位置")
- moveTo(x,y)
- moveBy(x,y)
- resizeTo(x,y)
- resizeBy(x,y)

#### Scroll API

###### scroll元素

1. scrollTop：可滚动内容上端（竖向位置）
2. scrollLeft：可滚动内容左端（横向位置）
3. scrollWidth：滚动最大宽度
4. scrollHeight：滚动最大高度
5. scroll(x,y)：scrollTo，滚动到
6. scrollBy(x,y)：从当前位置，滚动一个差值
7. scrollIntoView()：滚至可见区域

###### window对象的scroll

1. scrollX
2. scrollY
3. scroll(x,y)：scrollTo，滚动到
4. scrollBy(x,y)：从当前位置，滚动一个差值

#### layout API

- getClientRects：获取所有盒
- getBoundingClientRect：获取外面的盒

#### 其他API

API的来源：4个标准化组织

1. khronos：webGL
2. ECMA：ECMAScript
3. WhatWG：HTML
4. W3C：webaudio……















