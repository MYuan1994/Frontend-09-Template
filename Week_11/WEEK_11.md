# 第十一周

## 课程笔记

### css总论

css2.1语法标准文档地址：

- https://www.w3.org/TR/CSS21/grammar.html#q25.0 
- https://www.w3.org/TR/css-syntax-3

#### At-rule

At-rule文档地址：（加粗为重要内容）

- @charset （字符集声明）: https://www.w3.org/TR/css-syntax-3/ 
- @import ：https://www.w3.org/TR/css-cascade-4/ 
- **@media**（条件规则） ：https://www.w3.org/TR/css3-conditional/ 
- @page （仅用于特定环境：分页媒体，打印相关）： https://www.w3.org/TR/css-page-3/ 
- @counter-style （列表样式）：https://www.w3.org/TR/css-counter-styles-3 
- **@keyframes**（动画） ：https://www.w3.org/TR/css-animations-1/ 
- **@fontface**（字体，定义字体及表情时可用） ：https://www.w3.org/TR/css-fonts-3/
- @supports（验证兼容性，但本身兼容性存在问题，暂不推荐） ：https://www.w3.org/TR/css3-conditional/
- @namespace （HTML以外的命名空间）：https://www.w3.org/TR/css-namespaces-3

#### 普通规则

##### css规则结构

- 选择器
- 声明
  - key
  - value

##### css规则标准

1. selector
   - https://www.w3.org/TR/selectors-3/ 
   - https://www.w3.org/TR/selectors-4/
2. key
   - Properties普通属性
   - Variables（css变量）: https://www.w3.org/TR/css-variables/
3. value
   - https://www.w3.org/TR/css-values-4/

### css选择器

产生式写法

```javascript
selectors_group
  : selector [ COMMA S* selector ]*
  ;

selector
  : simple_selector_sequence [ combinator simple_selector_sequence ]*
  ;

combinator
  /* combinators can be surrounded by whitespace */
  : PLUS S* | GREATER S* | TILDE S* | S+
  ;

simple_selector_sequence
  : [ type_selector | universal ]//类型|*星号
    [ HASH | class | attrib | pseudo | negation ]*
  | [ HASH | class | attrib | pseudo | negation ]+
  ;

type_selector
  : [ namespace_prefix ]? element_name
  ;

namespace_prefix
  : [ IDENT | '*' ]? '|'
  ;

element_name
  : IDENT
  ;

universal
  : [ namespace_prefix ]? '*'
  ;

class
  : '.' IDENT
  ;

attrib
  : '[' S* [ namespace_prefix ]? IDENT S*
        [ [ PREFIXMATCH |
            SUFFIXMATCH |
            SUBSTRINGMATCH |
            '=' |
            INCLUDES |
            DASHMATCH ] S* [ IDENT | STRING ] S*
        ]? ']'
  ;

pseudo
  /* '::' starts a pseudo-element, ':' a pseudo-class */
  /* Exceptions: :first-line, :first-letter, :before and :after. */
  /* Note that pseudo-elements are restricted to one per selector and */
  /* occur only in the last simple_selector_sequence. */
  : ':' ':'? [ IDENT | functional_pseudo ]
  ;

functional_pseudo
  : FUNCTION S* expression ')'
  ;

expression
  /* In CSS3, the expressions are identifiers, strings, */
  /* or of the form "an+b" */
  : [ [ PLUS | '-' | DIMENSION | NUMBER | STRING | IDENT ] S* ]+
  ;

negation
  : NOT S* negation_arg S* ')'
  ;

negation_arg
  : type_selector | universal | HASH | class | attrib | pseudo
  ;
```

selector level 4新增：

更多的伪类、not有更强大的功能、css variables

四种函数：

- **calc**：常用，计算值，可用css变量
- max
- min
- clamp：裁剪

#### 简单选择器

1. *：通配符
2. div  svg|a：类型选择器，匹配标签的tagName属性
   - HTML
   - svg，使用|分隔开，|被称为命名空间分隔符（其实仅重复a标签）
   - MathML
3. .cls：空白分隔符可指定多个class名
4. #id
5. [attr=value]：包含3、4，前面加波浪线开头~：像class一样，拿空格分隔值的序列；前面加单竖线开头|：属性以此开头
6. ：hover：伪类（可带函数），多用于用户交互
7. ::before：伪元素，可用单冒号，为了规范和容易区分，用使用::

#### 复合选择器

combined selector，写作\<simpleSlector\>\<simpleSlector\>……

多个简单选择器的连写，表示**“与”**关系，并要求type selector或者*写在最前。

#### 复杂选择器

使用连接符连接复合选择器形成：

1. \<combinedSelector\>\<sp\>\<combinedSelector\>：子孙选择器
2. \<combinedSelector\>\>\<combinedSelector\>：父子选择器
3. \<combinedSelector\>~\<combinedSelector\>：相邻前一个
4. \<combinedSelector\>\+\<combinedSelector\>：相邻后一个
5. \<combinedSelector\>\||\<combinedSelector\>：做表格时选中一列（level 4新增）
6. \<combinedSelector\>\，\<combinedSelector\>：表示**或**关系

#### 选择器优先级计算

优先级就是分配给指定的 CSS 声明的一个权重，它由 匹配的选择器中的 每一种选择器类型的 数值 决定。

而当优先级与多个 CSS 声明中任意一个声明的优先级相等的时候，CSS 中最后的那个声明将会被应用到元素上。

当同一个元素有多个声明的时候，优先级才会有意义。因为每一个直接作用于元素的 CSS 规则总是会接管/覆盖（take over）该元素从祖先元素继承而来的规则。

下面列表中，选择器类型的优先级是递增的：

1. [类型选择器](https://developer.mozilla.org/en-US/docs/Web/CSS/Type_selectors)（例如，`h1`）和伪元素（例如，`::before`）
2. [类选择器](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors) (例如，`.example`)，属性选择器（例如，`[type="radio"]`）和伪类（例如，`:hover`）
3. [ID 选择器](https://developer.mozilla.org/en-US/docs/Web/CSS/ID_selectors)（例如，`#example`）。

**通配选择符**（universal selector）（[`*`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Universal_selectors)）**关系选择符**（combinators）（[`+`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Adjacent_sibling_combinator), [`>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Child_combinator), [`~`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/General_sibling_combinator), ['` `'](https://developer.mozilla.org/en-US/docs/Web/CSS/Descendant_combinator), [`||`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Column_combinator)）和 **否定伪类**（negation pseudo-class）（[`:not()`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:not)）对优先级没有影响。（但是，在  `:not()` 内部声明的选择器会影响优先级）。

一句以上权重得到四元数组[a,b,c,d]，利用一个足够大的常量N（一般是256的倍数以占满字节防止浪费）作计算，优先级的值最后写作：
$$
Specificity=a*N^3+b*N^2+c*N^1+d*N^0
$$


#### 伪类

根据用途分作三类：

1. 链接/行为：

   - ：any-link：所有超链接

   - ：link：所有未访问的超链接

   - ：link:visited：已访问的超链接

     当使用了link和visited后，无法继续更改元素除文字颜色之外的属性了

     **原因**：使用layout相关属性后，例如修改visited的尺寸，这样会影响排版，如此，通过js即可获取链接是否被visited，此时，便可以获取用户访问网站的行为，如此是违背浏览器的安全性的。

   - ：hover：悬停

   - ：active：激活状态

   - ：focus：聚焦（新有focus-within，经常在搜索框使用）

   - ：target：链接到当前目标，给作为锚点的a标签使用

2. 树结构：

   - 1：empty：是否有子元素

   - ：nth-child()：第n个子元素，可使用表达式，但不建议过于复杂

   - 2：nth-last-child()：倒数第n个

   - ：first-child(),3：last-child(),4：only-child()

     1234都违反了回溯原则，性能都比较差，134影响不大。

3. 逻辑型（现仅not可用）

   - ::not：仅支持复合选择器，表示非
   - ::where
   - ::has

#### 伪元素

分为两组：

会形成不存在的元素，使用后，declaration中可添加content属性：

- ::before：在元素内容前插入
- ::after：在元素内容后插入

选择元素：

- ::first-line：选中第一行，可用属性有：
  - font
  - color
  - background
  - Word-spacing
  - letter-spaccing
  - Text-decoration
  - text-transform
  - line-height
- ::first-letter：选中第一个字母，可用属性有：
  - font
  - color
  - background
  - Word-spacing
  - letter-spaccing
  - Text-decoration
  - text-transform
  - line-height
  - float
  - Vertical-align
  - 盒模型:margin, padding, border

## 补充

### css变量

带有前缀`--`的属性名，比如`--example--name`，表示的是带有值的自定义属性，其可以通过 [`var`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/var()) 函数在全文档范围内复用的。

CSS 自定义属性是可以级联的：每一个自定义属性可以多次出现，并且变量的值将会借助级联算法和自定义属性值运算出来。

写法

```css
:root {
  --first-color: #488cff;
  --second-color: #ffff8c;
}

#firstParagraph {
  background-color: var(--first-color);
  color: var(--second-color);
}
```



## 思考题

first-line不可使用float的原因：

答：

1. 导致父容器全部脱离文档流的后果

   float的MDN定义：

   > float CSS属性指定一个元素应沿其容器的左侧或右侧放置，允许文本和内联元素环绕它。虽然其仍然保持部分的流动性（与绝对定位相反），但该元素已从网页的正常流动(文档流)中移除。

   若对first-line元素添加float可以生效，将会出现first-line的选择器的父容器中的首行部分被移出文档流的情况，那么原父容器中将会有新的满足first-line的元素。

2. 整行的float对排版无意义。