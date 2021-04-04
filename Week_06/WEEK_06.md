# 第六周

## 随堂笔记

### 产生式（BNF）

用尖括号括起来的名称来表示语法结构名

语法结构分成基础结构和需要其他语法结构定义的复合结构

其中，基础结构称为终结符，复合结构称为非终结符（终结符不代表语法终结，代表的是语法的最小元素）

引号及其中间字符表示终结符

*表示重复多次

|表示或

+表示至少一次

### 现代语言分类

> **乔姆斯基谱系**：是计算机科学中刻画形式文法表达能力（复杂程度）的一个分类谱系，是由诺姆·乔姆斯基于 1956 年提出的。它包括四个层次：
>   - 0- 型文法（无限制文法或短语结构文法）包括所有的文法。
>   - 1- 型文法（上下文相关文法）生成上下文相关语言。
>   - 2- 型文法（上下文无关文法）生成上下文无关语言。
>   - 3- 型文法（正规文法）生成正则语言。
>

**依据形式语言的用途**：

数据描述语言：JSON,HTML,XAML(可扩展应用程序标记语言),SQL,CSS,XML,SGML

编程语言：C,C++,C#,Java,VB,Python,Ruby,Perl,Lisp,T-SQL,Clojure,Haskell,JavaScript

**依据表达方式**：

声明式语言--仅告知结果：JSON,HTML,XAML,SQL,CSS,Haskell,Lisp,SGM,XML,XQuery

命令式语言--告知达成的步骤：C,C++,C#,Java,Python,JavaScript,Perl

**动态语言及静态语言**：

动态语言：（弱类型语言）是运行时才确定数据类型的语言，变量在使用之前无需申明类型，通常变量的值是被赋值的那个值的类型。比如Php、Asp、JavaScript、Python

静态语言：（强类型语言）是编译时变量的数据类型就可以确定的语言，大多数静态语言要求在使用变量之前必须生命数据类型。比如Java、C、C++、C#

### 编程语言的性质

1. 图灵完备性：所有的可计算的问题都可用来描述的语言具备图灵完备性。
2. 动态与静态：动态->运行于用户机器runtime；静态->运行于开发者机器Compiletime。（解释型语言没有严格的Compiletime）

### 类型系统

1. 动态类型系统与静态类型系统：用户/开发者 机器里内存里可以找到的类型

   例：javaScript为动态类型，C类为静态类型，Java因为反射机制不完全归于静态或动态。

2. 强类型与弱类型：类型转换是否会默认发生

3. 复合类型

4. 子类型

5. 泛型（逆变、协变）泛型类型参数支持协变和逆变，可在分配和使用泛型类型方面提供更大的灵活性。

   逆变：指能够使用比原始指定的派生类型的派生程度更小（不太具体的）的类型

   协变：指能够使用比原始指定的派生类型的派生程度更大（更具体的）的类型

### JavaScript类型

#### Number

**组成**：

IEEE 754中的*Double Float*

- sign（1bit）符号位，表示正负
- Exponent（11）指数位，表示数据的范围
- Fraction（52）尾数位（有效位数），表示数据的精度

$$
(-1)^s*1.f*2^e
$$

Exponent部分实际构成可理解为1+10，10000000000为基准值，0xxxxxxxxxx为负1xxxxxxxxxx为正，表示的区间为：

00000000000（即2^-10）~11111111111（即2^10）；

Fraction前默认带有1开头。

**语法**：

- 10进制：0	0.	.2	1e3
- 2进制：0b110（以0b开头）
- 8进制：0o10（以0o开头）
- 16进制：0xFF（以0x开头）

#### [String](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String)

String由Character组成，计算机中使用code point表示Character，使用码点及一定类型信息即可表示Character。

- 字符Character

- 码点 Code Point

  - ASCII：0~127，表示大小写字母、数字、制表符、控制字符等

  - Unicode：全世界的所有文字的编码大合集，为各种语言分了片区，字符集范围：000~FFFF

  - UCS：Unicode与另一组织合并时产生，字符集范围：0000~FFFF

  - GB 国标，和Unicode码点不一致，但与其他所有字符集都兼容ASCII码

    - GB2312 ：首版，使用较广泛
    - GBK(GB13000) 
    - GB18030：真正的大全

    相对于Unicode节省空间

  - ISO-8859：东欧国家制定，8859系列互不支持，非同一标准，无中文支持
  - BIG5：台湾的编码标准

  以上均兼容ASCII码，最后两个互相冲突、码点重复无法混合使用

- 编码方式 Encoding

  - UTF8：Unicode中ASCII范围用之表示，占一个字节（8bit），因其默认使用一个字节表示一个字符，所以一段ASCII编码的文字，一定也是UTF8编码的一段文字。但默认使用一个字节不代表仅可能使用一个字符，实际使用时可能用两个甚至更多，因其需要控制位才可以填下某些字符，控制位的作用是表示字节间的关系。
  - UTF16：前面补0，占用2字节（16bit）

**语法**：

关于引号：

**单双引号**：

两者完全等效，可以互相嵌套。

**反引号**：``

内部可以使用除反引号外的特殊字符，结合${}变量的使用，字符串的最终的解析结果为以下四种Token：

- `……${
- }……${
- }……`
- 变量

**特殊字符**：

- \a  Bell 
- \b  Backspace
- \f  Form Feed
- \n  换行符
- \r  Carriage Return-->"" 回车
- \t  Tab
- \v  Vertical Tab
- \x  16进制
- \u  unicode码 

#### Boolean

true/false

#### Null

关键字，但被设计成Object（typeof可得），表示有值但为空。

#### Undefined

全局变量，可赋值（**离职小技巧**），表示未定义的值，一般用void 0产生。

#### [Object](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object)

*与重学前端重复部分笔记暂未记录*

##### 对象的认知

1.`对象`**三要素**：

- 唯一性(Identifier)：
- 行为(behavior)：对象状态的改变
- 状态(state)

2.描述对象的方式——**类**（class）：

​	归类：将单个对象或者类提取共性，依据这些共同特性将某些对象归类或者将类归为更高的抽象类。

​		多继承->一个对象属于很多类。

​	分类：从Object开始，具象化某些特性，分支为具体的类。

​		单继承->子类或对象只能属于父类，属于从属关系。

3.javaScript描述对象的方式——**原型**（Prototype）:

​	任何对象仅需描述其与原型的区别即可，最原始的原型是Object.Prototype，继续往上就是Nihilo，即Null。

##### javaScript中的Object

js中使用原型<u>[[Prototype]]</u>和属性<u>property</u>即可描述一个对象。

JavaScript中的状态及行为使用属性描述，而其唯一标识性则采用内存地址唯一性表示。

JavaScript原生支持原型机制，JavaScript获取属性的行为中，如果一个对象不存在某个属性，js会继续以链式寻找的方式向上寻找原型的原型，直到Nihilo即Null。由此特性，也将JavaScript中的原型描述为原型链。

因为这种原型机制，任何对象仅需描述其与原型的区别即可。

##### Object的属性

js中对象的属性是k-v对的形式存在。

**K**：其中属性名k的数值类型可以为String或者symbol，其中String属性知道名称既可直接通过点运算读写，而Symbol仅可以通过变量名获取，保证了属性访问的权限控制。

**V**：属性值分为两种：

- 数据属性（Data Property）：

  其具体的值[[value]]可以取任意类型的值（7种）；

  并且会有writable（是否可写，是否可以通过点运算更改，通过defineProperty依然可以修改特征值）、enumerable（是否可枚举）、configurable（是否可改变）的attribute（理解为特征），其中configurable设置为false后，属性的所有特征值都将不可改写设置。

  一般用于描述状态，如果存储了一个函数，也可用于描述行为。

- 访问器属性（Accessor Property）：

  必须有get或者set之一，也具有enumerable、configurable的特征值。

  一般用于描述行为。

##### 原型机制

当JavaScript使用点运算访问对象的属性时，如果一个对象不存在某个属性，js会继续以链式寻找的方式向上寻找原型的原型，直到Nihilo即Null。由此特性，也将JavaScript中的原型描述为原型链。

因为这种原型机制，任何对象仅需描述其与原型的区别即可。

##### 语法与API

1. {} [] . Object.defineProperty：提供基本的对象机制，使开发者可以通过语法去创建对象、访问属性、定义新属性、改变属性的特征值（基本的面向对象的方法）。
2. Object.create/Object.setPrototypeOf/Object.getPrototypeOf：基于原型的描述对象的方法，可以在指定原型的基础上创建对象，也可以获取原型、修改原型。
3. new/class/extends：基于分类的方式描述对象。
4. new/function/prototype：类似于class base，不推荐使用

##### function对象

引用[JavaScript 标准内置对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects)描述：

> JavaScript基本对象是定义或使用其他对象的基础。基本对象包括一般对象、函数对象和错误对象。
>
> 每个 JavaScript 函数实际上都是一个 `Function` 对象

function是一个带call方法（内置行为，用[[]]定义，用任何方式都无法访问）的对象。使用function关键字、箭头运算或Function构造器创建对象，都会带有[[call]]这个行为。

##### Host对象（宿主对象）

JavaScript语言未定义，由宿主环境定义的对象。可以实现JavaScript原生不支持但语法支持的特性。

##### 特殊行为对象

> Array：Array 的 length  属性根据最大的下标自动发生变化。
>
> Object.prototype：作为所有正常对象的默认原型，不能再给它设置原型了。
>
> String：为了支持下标运算，String 的正整数属性访问会去字符串里查找。
>
> Arguments：arguments 的非负整数型下标属性跟对应的变量联动。
>
> 模块的 namespace  对象：特殊的地方非常多，跟一般对象完全不一样，尽量只用于 import 吧。类型数组和数组缓冲区：跟内存块相关联，下标运算比较特殊。
>
> bind  后的 function：跟原来的函数相关联。

#### Symbol

week_04笔记已记录，暂无新增





