# 第九周

## HTML分析

### 标签分析（包含属性分析）

#### 词法分析

需分别辨识四类：

1. 开始标签（需识别属性）
2. 结束标签
3. 自封闭标签（需识别属性）
4. 文本内容

需要创建的状态机有：

- data：无正在写入标签的状态
  - 接收<，开始写入标签
  - 接收EOF，判断输入结束，<u>将EOFemit出去</u>，然后结束
  - 否则，判定为文本内容，<u>直接将字符emit出去</u>
  
- tagOpen：开始写入标签状态
  - 接收/，判断标签为结束标签，进入endTagOpen
  
  - 接收大小写字母，判断开始写入tag的名字，<u>currentToken的type设置为startTag，tageName设初值“”</u>，并进入tagName并继续处理
  
    标签结束前无法确认tag是起始标签还是子封闭标签，在后面用属性值selfClosing来区分。
  
- endTagOpen：写入结束标签的状态
  - 接收大小写字母，判断开始写入tag的名字，<u>currentToken的type设置为endTag，tageName设初值“”</u>进入tagName状态并继续处理。
  - 接收>或者EOF均判定为语法错误
  
- tagName：写入标签名字的状态
  - 接收到换行、换页、制表、空格时表示标签名书写结束，进入设置属性值的状态beforeAttributeName
  - 接收/，判断标签类型为代表tag为自封闭标签，进入selfClosingStartTag状态
  - 接收大小写字母，继续标签的输入，<u>将字符char拼接到currentToken的tagName属性上</u>
  - 接收到>，表示标签输入结束，把currentToken emit出去，重新进入无正在写入标签的状态data
  - 接收以上情况外其余输入，继续标签的输入（为解决标签名带有其他类型字符的情况，如H1，H2等）
  
- beforeAttributeName：即将设置属性名的状态
  - 接收到换行、换页、制表、空格时表示格式调整，保持当前状态
  - 接收到/、>、EOF，判断继续输入内容不属于属性，进入afterAttributeName并继续处理当前字符
  - 接收到=，属性名不会以=开始，语法错误
  - 以上情况外，判断接收到可作为属性名的合理字符，设置初始化的currentAttribute（属性名name和属性值value置为""），进入设置属性的attributeName状态
  
- attributeName：正在设置属性名的状态

  - 接收到换行、换页、制表、空格、/、>、EOF时，判断属性名输入完毕并且无需输入属性值，进入afterAttributeName并继续处理当前字符
  - 接收=，判断属性名输入完毕且需要输入属性值，进入属性值输入状态beforeAttributeValue
  - 接收空字符（\u0000）,语法错误
  - 接收双引号"、单引号'或者<，判断语法错误
  - 接受其他符合格式字符，判断继续写入属性名，拼接c到currentAttribute.name上，并保持当前状态。

- afterAttributeName：输入属性名结束之后的状态

- beforeAttributeValue：即将输入属性值的状态

  - 接收到换行、换页、制表、空格、/、>、EOF时，
  - 接收到双引号时，进入doubleQuotedAttributeValue状态并继续处理当前字符
  - 接收到单引号是，进入singleQuotedAttributeValue状态并继续处理当前字符
  - 接收到<时，语法错误
  - 否则，判断当前为符合格式的无引号输入值，进入UnquotedAttributeValue状态并继续处理当前字符

- UnquotedAttributeValue：输入的属性值为无引号的格式

  - 接收到换行、换页、制表、空格时，为判断当前属性输入完毕，为currentToken设置属性currentAttribute.name值为currentAttribute.value，进入继续设置属性的状态beforeAttributeName
  - 接收到/，为判断属性输入完毕且当前标签为自封闭标签，为currentToken设置属性currentAttribute.name值为currentAttribute.value，进入继续设置属性的状态selfClosingStartTag
  - 接收到>，为判断当前标签输入完毕，为currentToken设置属性currentAttribute.name值为currentAttribute.value，将currentToken emit出去后进入无正在写入标签的状态data
  - 接收空字符（\u0000）,语法错误
  - 接收双引号、单引号、<、=、`，语法错误
  - 接收EOF，语法错误
  - 其余情况视为符合格式的属性值输入，继续拼接属性值，并保持当前状态UnquotedAttributeValue

- doubleQuotedAttributeValue：输入的属性值为双引号引号的格式

  - 基本逻辑同上，等双引号

- singleQuotedAttributeValue：输入的属性值为单引号的格式

  - 基本逻辑同上，等单引号

- selfClosingStartTag：写入自封闭标签的状态
  - 接收>，判断标签输入结束，因为已经判断为自封闭标签，故设置currentToken的属性值selfClosing为true，返回无正在写入标签的data状态
  - 接收EOF，书写错误

#### 句法分析

当获取到完整的标签或文本（统称为token）的时候，进行句法分析，利用词法分析中产生的token，以栈为容器，形成dom树。

### 完整HTML语法词法标准地址

词法状态：https://html.spec.whatwg.org/multipage/parsing.html#tokenization

在各种状态下配对标签：https://html.spec.whatwg.org/multipage/parsing.html#tree-construction

## CSS计算

### 收集css规则

需要收集的css规则有：

1. style标签内规则（课程内仅收集此部分规则）

   使用现成的css规则分析

2. link外联样式规则

3. dom标签内内联规则

### 计算规则

#### 添加调用

在创建完成一个开始标签或者自封闭标签后即可开始计算css规则，现仅计算在style标签获取到的css规则，body内标签的内联样式需要重新计算覆盖，暂时不处理。

#### 获取父元素序列

计算一个element的样式，需要获取其所有父元素的规则，由于先获取当前元素，故父元素序列的获取方向是由内至外。

### 规则作用于元素

#### 选择器与元素匹配

> ​		在 CSS  规则中，选择器部分是一个**选择器列表**。选择器列表是用逗号分隔的复杂选择器序列；复杂选择器则是用空格、大于号、波浪线等符号连接的复合选择器；复合选择器则是连写的简单选择器组合。根据选择器列表的语法，选择器的连接方式可以理解为像四则运算一样有优先级：
>
> 1. 第一优先级无连接符号；
> 2. 第二优先级“空格”“~”“+”“>”“||”；
> 3. 第三优先级“,”。
>
> 复合选择器表示简单选择器中“且”的关系；
>
> ​		而复杂选择器是针对节点关系的选择，它规定了五种连接符号：
>
> - “空格”：后代，表示选中所有符合条件的后代节点， 例如“ .a .b ”表示选中所有具有 class 为 a 的后代节点中 class 为 b 的节点。
> - “>”  ：子代，表示选中符合条件的子节点，例如“ .a>.b ”表示：选中所有“具有 class 为 a 的子节点中，class 为 b  的节点”。
> - “~” : 后继，表示选中所有符合条件的后继节点，后继节点即跟当前节点具有同一个父元素，并出现在它之后的节点，例如“ .a~.b  ”表示选中所有具有 class 为 a 的后继中，class 为 b 的节点。
> - “+”：直接后继，表示选中符合条件的直接后继节点，直接后继节点即  nextSlibling。例如 “.a+.b ”表示选中所有具有 class 为 a 的下一个 class 为 b  的节点。
> - “||”：列选择器，表示选中对应列中符合条件的单元格。

保证选择器与父元素序列都为由内向外。使用双指针完成两者的匹配。

复杂选择器需要拆分至复合选择器/简单选择器处理。

#### 生成computed属性

当选择器与元素匹配时，直接将规则应用到元素上，生成computedStyle，后续依据computedStyle中具体的declaration.property，在specificity（specificity：独特性；明确性，具体性；剑桥词典—>the [quality](https://dictionary.cambridge.org/zhs/词典/英语-汉语-简体/quality) of being [specific](https://dictionary.cambridge.org/zhs/词典/英语-汉语-简体/specific) (= [clear](https://dictionary.cambridge.org/zhs/词典/英语-汉语-简体/clear) and [exact](https://dictionary.cambridge.org/zhs/词典/英语-汉语-简体/exact))）和后来优先的规则下进行覆盖/添加。

**specificity**：每条规则的specificity结构是四元组，格式如[0,0,0,0]，四位分别对应元素匹配规则的选择器属于inline，id，class，tagName的数量，从左到右权重降序。

多组rule会有多个specificity组，按照不进位制比较，有较高权重者，相同属性会覆盖权重较低的。specificity包含所有的简单选择器的相加。

## 课程外

### AMD与CommonJS

#### 规范文档

CommonJS：http://wiki.commonjs.org/wiki/Modules/1.1

AMD：https://github.com/amdjs/amdjs-api/wiki/AMD

ES6 module(非官方，规范未找到该部分):http://caibaojian.com/es6/module.html

#### 模块化

每个文件就是一个模块，有自己的作用域。在一个文件里面定义的变量、函数、类，都是私有的，对其他文件不可见。

如想共享，需要将js文件依序加载到同一页面（环境）或者将变量定义为`global`对象的属性。前者对加载顺序严格要求容易出错，后者容易造成变量污染和变量名冲突。

#### CommonJS

CommonJS规范规定，每个模块内部，`module`变量代表当前模块。这个变量是一个对象，它的`exports`属性（即`module.exports`）是对外的接口。加载某个模块，其实是加载该模块的`module.exports`属性。依据不同需求写法有多种：

```javascript
module.exports = { addCSSSSRules,computeCSS };
module.exports =  parserHTML ;
module.exports.x = x;
```

为了方便，Node为每个模块提供一个exports变量，指向module.exports，如此，以上代码可以简写。这等同在每个模块头部，有一行这样的命令。

```javascript
var exports = module.exports;
```

使用全局性方法require()加载模块，写作：

```javascript
const  XXXX = require('文件位置及名字');
const { addCSSSSRules,computeCSS }=require('./cssRule');
```

#### AMD

释义为：Asynchronous Module Definition（**异步模块定义**）

> 它采用异步方式加载模块，模块的加载不影响它后面语句的运行。所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行。

使用define定义模块，例：

```javascript
define("alpha", ["require", "exports", "beta"], function (require, exports, beta) {
       exports.verb = function() {
           return beta.verb();
           //Or:
           return require("beta").verb();
       }
   });
```

引用也是用require，但是参数不同
$$
require([module], callback);
$$
例如：

```javascript
require(['math'], function (math) {
　　　　math.add(2, 3);
});
```

#### ES6模块规范

ES6使用 export 和 import 来导出、导入模块。例：

```javascript
// profile.js
var firstName = 'Michael';
var lastName = 'Jackson';
var year = 1958;

export {firstName, lastName, year};
```

export命令规定的是对外的接口，必须与模块内部的变量建立一一对应关系

```javascript
// 写法一
export var m = 1;
// 写法二
var m = 1;
export {m};
// 写法三
var n = 1;
export {n as m};
```

使用export default命令，为模块指定默认输出。

```javascript
export default function () {
  console.log('foo');
}
```

## TODO

- [x] 模块化：了解AMD与CommonJS

- [x] 拆分模块：将client中的request拆分出来，parse中词法句法和css处理部分进行拆分

- [ ] https://html.spec.whatwg.org/multipage/parsing.html

  Tokenization、tree-construction部分，略读=>精读

- [x] 词法句法分析部分尝试实现更多状态机

- [x] 复合选择器实现：课程默认复杂选择器内直接包含简单选择器，不对复合选择器出现的情况处理，可以使用正则拆分selector，然后后续添加条件判断。

- [x] 支持空格的class选择器：课程中假设class不会写多个，实现多class处理



