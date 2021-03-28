# 第五周

## Proxy

在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。

### 常规声明方式：

​	`const p = new Proxy(target, handler)`

​	**参数解释**：

- target：要被代理的目标对象，即被 Proxy 代理虚拟化的对象。它常被作为代理的存储后端。根据目标验证关于对象不可扩展性或不可配置属性的不变量（保持不变的语义），可以为数组、函数、其他代理等任何数据类型的对象。

- handler：一个通常以函数作为属性的对象，各属性中的函数c分别定义了在执行各种操作时代理 `proxy` 的行为。

### 其他使用方法：

Proxy 对象，设置到`object.proxy`属性上，使用object即可调用

```javascript
var object = { proxy: new Proxy(target, handler) };
```

作为其他对象的原型对象。例：proxy作为obj的原型，根据原型链，操作obj会变为操作proxy，触发proxy上的拦截器

```javascript
var proxy = new Proxy({}, {
  get: function(target, propKey) {
    return 35;
  }
});

let obj = Object.create(proxy);
```

  同一拦截器可以设置多个拦截操作。

### 支持的拦截操作

1. #### **get(target, propKey, receiver)**：

   - target：目标对象
   - propKey：被获取的属性名或者symbol对象
   - receiver：Proxy或者继承Proxy的对象

   拦截目标对象属性的读取，在访问目标对象属性、访问原型链上的属性以及Reflect.get()时会被拦截

2. #### **set(target, propKey, value, receiver)**：

   - ……
   - value：新属性值
   - receiver：一般为proxy本身，若是在原型链上被间接调用，receiver也有的可能是以该proxy为原型的obj。

   拦截目标对象属性的设置。

3. **apply(target, thisArg, argumentsList) **：

   - target：必须为可调用的函数对象。
   - thisArg：被调用时的上下文对象。
   - argumentsList：被调用时的参数数组。

   拦截proxy实例作为函数的调用，在进行`proxy(...args)`、`Function.prototype.apply()`、`Function.prototype.call()`以及Reflect.apply()时调用。

4. **construct(target, argumentsList, newTarget)**：

   - argumentsList：构造函数的参数列表
   - newTarget：最初被调用的构造函数。即new的实例

   用于拦截new操作符，可以拦截`new Proxy(...args)`、`Reflect.construct()`。

   *注：拦截操作必须返回一个对象；IE不支持*

5. **defineProperty(target, property, descriptor)**：

   - property：待检索其描述的属性名
   - descriptor：待定义或修改的属性的描述符

   拦截对对象的 `Object.defineProperty()`、`Reflect.defineProperty()`、`proxy.property=value`操作。

6. **deleteProperty(target, property)**：

   - target：待处理的目标对象
   - property：待删除的属性名

   拦截对象删除属性的操作，比如：`delete proxy[foo]`和 `delete proxy.foo`以及`Reflect.deleteProperty()`。

7. **getOwnPropertyDescriptor(target, prop)**：

   - prop：返回属性名称的描述

   拦截获取对象指定属性的操作，Object.getOwnPropertyDescriptor()和Reflect.getOwnPropertyDescriptor()操作。

    *注：必须返回object 或 undefined*

8. **getPrototypeOf(target)**：

   - target：被代理的目标对象。

   拦截读取代理对象的原型的操作，this指向的是它所属的处理器对象，返回值必须是一个对象或者 null。

   JS中有5种操作可以触发引擎读取对象的原型（进行getPrototypeOf()操作）：

   1. `Object.getPrototypeOf()`
   2. `Reflect.getPrototypeOf()`
   3. `__proto__`(*已从web标准中删除，经量不使用*)
   4. `Object.prototype.isPrototypeOf()`
   5. `instanceof`

9. **has(target, prop)**：

   - ……
   - prop：需要检查是否存在的目标属性

   可以看作针对in操作的钩子函数，可以拦截：

   1. 属性的查询：`foo in proxy`
   2. 继承属性查询：`foo in Object.create(proxy)`
   3. with检查：`with(proxy){(foo);}`
   4. `Reflect.has()`

10. **isExtensible(target)**：

    拦截对对象是否可以拓展进行判断的操作，isExtensible用于判断对象是否可以扩展（是否可以给它添加新属性），返回值为布尔值或者可解释为布尔值的值(0/1,"true"/"false")。

11. **ownKeys(target)**：

    拦截查询目标对象自身的属性键组成的数组的操作，实际上是对Reflect.ownKeys()的拦截；必须返回一个可枚举对象。可以拦截的操作有：

    - `Object.getOwnPropertyNames()`
    - `Object.getOwnPropertySymbols()`
    - `Object.keys()`（参数必须传入对象，但ES2015中对非对象参数做了转换）
    - `Reflect.ownKeys()`

12. **preventExtensions(target)**：

    - target：所要拦截的目标对象.

    拦截将对象变为不可扩展对象的操作，可拦截`Object.preventExtensions()`和`Reflect.preventExtensions()`

13. **setPrototypeOf(target,prototype)**：

    - target：被拦截目标对象
    - prototype：对象新原型或为null

    拦截修改指定对象原型的操作，可拦截`Object.setPrototypeOf()`和`Reflect.setPrototypeOf()`。

## CSSOM(css对象模型)

### CSS Object Model 

**文档**：

> *The CSS Object Model is a set of APIs allowing the manipulation of CSS from JavaScript. It is  much like the DOM, but for the CSS rather than the HTML. It allows users to read and modify CSS style dynamically.*

以上为MDN的释义。[:satisfied:CSSOM_MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/CSS_Object_Model)

另：作为W3C中一个独立模块，最原始文档在此<!--（翻译过来都看不动，拉闸）-->[:sob:CSSOM_W3C](https://www.w3.org/TR/cssom-1/)

**简介**：

​		一组API，它允许JavaScript动态读取和修改CSS。模式类似于DOM，只不过根据MDN释义，DOM是处理HTML，而CSSOM用于处理CSS。

以W3C的标准释义，CSSOM分为Model（描述样式表和规则的模型）和View（元素视图相关的API）

​		浏览器处理页面(HTML)的过程是：Bytes->Characters->Tokens->Nodes->DOM

​		处理WEB样式时是：Bytes->Characters->Tokens->Nodes->DOM

​		每当浏览器为页面上对象将所有样式进行最后计算时，会从最通用规则的样式，以递归的方式向下合并至最具体规则的样式（所谓Cascade），因此CSSOM最后也会形成类似于DOM树的树形结构（实际上CSSOM依赖于DOM，因为其并一定能形成完整的树）。

### API列表

> - [`AnimationEvent`](https://developer.mozilla.org/zh-CN/docs/Web/API/AnimationEvent)
> - [`CaretPosition` (en-US)](https://developer.mozilla.org/en-US/docs/Web/API/CaretPosition)
> - [`CSS`](https://developer.mozilla.org/zh-CN/docs/Web/API/CSS)
> - `CSSCharsetRule`
> - [`CSSConditionRule`](https://developer.mozilla.org/zh-CN/docs/Web/API/CSSConditionRule)
> - [`CSSCounterStyleRule` (en-US)](https://developer.mozilla.org/en-US/docs/Web/API/CSSCounterStyleRule)
> - [`CSSFontFaceRule` (en-US)](https://developer.mozilla.org/en-US/docs/Web/API/CSSFontFaceRule)
> - `CSSFontFeatureValuesMap`
> - `CSSFontFeatureValuesRule`
> - [`CSSGroupingRule`](https://developer.mozilla.org/zh-CN/docs/Web/API/CSSGroupingRule)
> - [`CSSImportRule` (en-US)](https://developer.mozilla.org/en-US/docs/Web/API/CSSImportRule)
> - [`CSSKeyframeRule` (en-US)](https://developer.mozilla.org/en-US/docs/Web/API/CSSKeyframeRule)
> - [`CSSKeyframesRule` (en-US)](https://developer.mozilla.org/en-US/docs/Web/API/CSSKeyframesRule)
> - `CSSMarginRule`
> - [`CSSMediaRule`](https://developer.mozilla.org/zh-CN/docs/Web/API/CSSMediaRule)
> - [`CSSNamespaceRule` (en-US)](https://developer.mozilla.org/en-US/docs/Web/API/CSSNamespaceRule)
> - [`CSSPageRule`](https://developer.mozilla.org/zh-CN/docs/Web/API/CSSPageRule)
> - [`CSSRule`](https://developer.mozilla.org/zh-CN/docs/Web/API/CSSRule)
> - [`CSSRuleList`](https://developer.mozilla.org/zh-CN/docs/Web/API/CSSRuleList)
> - [`CSSStylesheet`](https://developer.mozilla.org/zh-CN/docs/Web/API/CSSStyleSheet)
> - [`CSSStyleDeclaration`](https://developer.mozilla.org/zh-CN/docs/Web/API/CSSStyleDeclaration)
> - [`CSSSupportsRule`](https://developer.mozilla.org/zh-CN/docs/Web/API/CSSSupportsRule)
> - `CSSVariablesMap`
> - `CSSViewportRule`
> - [`ElementCSSInlineStyle` (en-US)](https://developer.mozilla.org/en-US/docs/Web/API/ElementCSSInlineStyle)
> - [`GeometryUtils` (en-US)](https://developer.mozilla.org/en-US/docs/Web/API/GeometryUtils)
> - `GetStyleUtils`
> - [`LinkStyle` (en-US)](https://developer.mozilla.org/en-US/docs/Web/API/LinkStyle)
> - [`MediaList`](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaList)
> - [`MediaQueryList`](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaQueryList)
> - `PseudoElement`
> - [`Screen`](https://developer.mozilla.org/zh-CN/docs/Web/API/Screen)
> - [`Stylesheet`](https://developer.mozilla.org/zh-CN/docs/Web/API/StyleSheet)
> - [`StylesheetList`](https://developer.mozilla.org/zh-CN/docs/Web/API/StyleSheetList)
> - [`TransitionEvent`](https://developer.mozilla.org/zh-CN/docs/Web/API/TransitionEvent)
>
> 以及CSSOM扩展的[`Document`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document), [`Window`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window), [`Element`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element), [`HTMLElement`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement), [`HTMLImageElement`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLImageElement), [`Range`](https://developer.mozilla.org/zh-CN/docs/Web/API/Range), [`MouseEvent`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent), 和 [`SVGElement`](https://developer.mozilla.org/zh-CN/docs/Web/API/SVGElement).

### API详情：

#### Range 

Range接口表示一个包含节点与文本节点的一部分的文档片段。

可以用 Document 对象的 Document.createRange 方法创建 Range，也可以用 Selection 对象的 getRangeAt 方法获取 Range。另外，还可以通过 Document 对象的构造函数 Range() 来得到 Range。

例子：

```javascript
var range = document.createRange();

//大部分方法必须设置临界点
range.setStart(startNode, startOffset);
range.setEnd(endNode, endOffset);
```

##### 属性

| 属性名                  | 含义                                                         |
| ----------------------- | ------------------------------------------------------------ |
| collapsed               | 表示是否起始点和结束点是同一个位置，true为重合               |
| commonAncestorContainer | 返回完整包含 startContainer 和 endContainer 的、最深一级的节点 |
| endContainer            | 返回range对象结束的节点                                      |
| endOffset               | 返回一个表示 Range 终点在 endContainer 中的位置的偏移值。    |
| startContainer          | 返回Range对象开始的节点                                      |
| startOffset             | 返回一个表示 Range 起点在 startContainer 中的位置的偏移值    |

##### 方法

###### 1）定位方法

1. setStart(startNode, startOffset):设置range的开始位置及偏移量
2. setEnd(endNode, endOffset):设置range的结束位置及偏移量
3. ???setStartBefore(referenceNode):相对节点referenceNode来设置一个新的节点替代其位置为range的开始位置
4. ???setStartAfter(referenceNode):相对节点referenceNode来设置一个新的节点在其之后为range的开始位置
5. ???setEndBefore(referenceNode):相对节点referenceNode来设置一个新的节点替代其位置为range的结束位置
6. ???setEndBefore(referenceNode):相对节点referenceNode来设置一个新的节点替代其位置为range的结束位置
7. selectNode(referenceNode)：将range设置为包含该节点及其内容
8. selectNodeContents(referenceNode):将range设置为包含该节点的内容
9. collapse(to):折叠range使两端重叠区间为空，to为布尔值，true代表折叠至起点，false代表折叠至终点

###### 2）编辑方法

1. cloneContents():克隆并返回range内所有节点的DocumentFragment
2. deleteContents():从document中删除range中的内容
3. extractContents():从document中删除range中的内容，并返回给一个DocumentFragment
4. insertNode(newNode):将newNode插入到range的起始位置
5. surroundContents(newParent):将 Range 对象的内容移动到一个新的节点，并将新节点放到这个范围的起始处

###### 3）其他

1. compareBoundaryPoints(how, sourceRange)：将一个range的边界点与另一个range的边界点进行比较，返回值为-1，0，1，分别表示range的对应边界点分别在sourceRange的对应边界点之前、等于或之后。
2. cloneRange():克隆range对象并返回全新的range对象，有相同的边界点且互不影响
3. detach():将range从内存中释放
4. toString():将range中内容以字符串形式返回。