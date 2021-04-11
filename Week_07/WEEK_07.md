# 第七周

## 课堂笔记

### 1_运算符及表达式

#### 语法树及运算符优先级

运算符优先级影响语法树的结构关系，一般用产生式表达，也可使用中缀树

**优先级：**

- **member**运算（分级的名称，并不单指member）

  - a.b：仅接受字符串

  - a[b]：支持运行时字符串（变量）
  - foo\`string：可传递参数
  - super.b：super作为对象使用
  - super['b']
  - new.target
  - new Foo()

- **new**运算

  - new Foo：不带括号优先级更低

- **call**运算

  - foo()
  - super()
  - foo()['b']
  - foo().b
  - foo()`abc`

- **left** HandSide和&**Right** HandSide：

  只有left Hand Expression才可以将运算内容放在等号左边。

  不能放到左边的有：

  - Update（变量自身变化）
  - Unary单目运算：
    - delete a.b
    - void foo()
    - typeof a
    - +a
    - -a
    - ~a
    - !a
    - await a
  - Exponental(唯一右结合)
    - **

- 更低一点

  - **Multiplicative**
    - */%
  - **Additive**:
    - +-
  - **Shift**:
    - << >> >>>
  - **Relationship**:
    - < > <= >= instanceof in

- 更低

  - **Equality**
    - ==
    - !=
    - ===
    - !===
  - **Bitwise**:
    - &^|

- 最低

  - **logical**逻辑运算
    - &&(短路规则)
    - ||
  - **Conditional**唯一的三目
    - ？：也有短路原则

**reference类型**

点运算（例如a.b），取出来不是属性值，而是一种运行时类型--引用类型reference，reference包含Object和key，完整的记录了member运算的两个部分。

另外，delete和assign也使用的reference类型。

- [x] 尝试理解几个使用reference类型的运算加深理解

#### 运行时中的类型转换

##### 七种基本类型的转换规则

|           | Number             | String              | Boolean  | Undefined | Null | Object | Symbol |
| --------- | ------------------ | ------------------- | -------- | --------- | ---- | ------ | ------ |
| Number    | -                  |                     | 0 false  | X         | X    | Boxing | X      |
| String    |                    | -                   | "" false | X         | X    | Boxing | X      |
| Boolean   | true 1<br/>false 0 | 'true' <br/>'false' | -        | X         | X    | Boxing | X      |
| Undefined | NaN                | 'Undefined'         | false    | -         | X    | X      | X      |
| Null      | 0                  | 'null'              | false    | X         | -    | X      | X      |
| Object    | valueOf            | valueOf<br>toString | true     | X         | X    | -      | X      |
| Symbol    | X                  | X                   | X        | X         | X    | Boxing | -      |

##### Unboxing拆箱转换

**作用**：将Object转换为其他基本类型

**过程**：

1. ToPremitive
2. toString vs valueOf
3. Symbol.toPrimitive

##### boxing装箱转换

| 类型    | 对象                    | 值          |
| ------- | ----------------------- | ----------- |
| Number  | new Number(1)           | 1           |
| String  | new String("a")         | "a"         |
| Boolean | new Boolean(true)       | true        |
| Symbol  | new Object(Symbol("a")) | Symbol("a") |

### 2_语句Statement

#### Grammar

- 简单语句

  内部不会容纳其他语句的语句

  举例：

  - ExpressionStatement表达式语句

  - EmptyStatement空语句

  - DebuggerStatement：Dubugger关键字触发断点

  - ThrowStatement：抛异常；控制语句

  - ContinueStatement：结束当次循环，后面循环继续；控制语句

  - BreakStatement：破环循环条件结束循环；控制语句

    break后面可以加标识符名字，实际上是一种label写法，带label可以直接跳出某个循环，节省逻辑上的判断。

    构成：

    - [[type]]:break continue
    - [[value]]:--
    - [[target]]:label

  - ReturnStatement：返回函数的值，用在其他函数里；控制语句

- 组合语句

  1. **BlockStatement***：{}包住语句列表，使需要单条语句的地方变成用多条语句对于完成语句结构有重要意义。

     构成：

     - [[type]]:normal
     - [[value]]:--
     - [[target]]:--

  2. IfStatement：分支结构，条件语句

  3. SwitchStatement：多分支结构；不建议用

  4. IterationStatement：

     while(…)……

     do ……while(…)

     for(…;…;…;)……

     for(…in…)……

     for(…of…)……

     ~~for await(of)~~：异步，带await版本的for of循环

     ……

  5. WithStatement：with打开对象将对象属性放入作用域；不建议用

  6. LabelledStatement：语句前加label

  7. TryStatement：

     try catch finally

     构成：

     - [[type]]:return
     - [[value]]:--
     - [[target]]:label

- 声明

  对后面语句发生作用的语句，可笼统归类为声明语句。

  举例：

  - FunctionDeclaration：function

  - GeneratorDeclaration：function *

  - AsyncFunctionDeclaration：async function

  - AsyncGeneratorDeclaration：async function *

  - VariableStatement：变量声明var
  - ClassStatement：class

  - LexicalStatement：const、let

  特殊概念：

  1. 预处理机制（pre-process）：

     所有声明都是有预处理机制的，都可以将变量变成局部变量。特殊的const在声明前使用会抛出可被catch的错误。

  2. 作用域：

     除循环语句这类特殊情况，let和const作用范围是block语句的花括号，循环中的作用域为整个循环

#### Runtime

- Completion Record完成记录

  非基本类型，用于储存语句完成的状态，由当前状态可知语句继续执行位置

  组成部分：

  1. [[type]]：normal,break,continue,return,throw

     语句本身具有一定的结构，因此语句中return等穿透类型在运行时可能会改变Completion 的type

  2. [[value]]：基本类型

  3. [[target]]：label

- Lexical Environment词法环境

### 3_结构化

#### 宏任务与微任务

> 于我们这里主要讲 JavaScript 语言，那么采纳 JSC 引擎的术语，我们把宿主发起的任务称为宏观任务，把 JavaScript 引擎发起的任务称为微观任务。

其中js中微任务只能由promise产生

**事件循环**（event loop）原是nodejs概念：

1. get code	
2. execute（实际过程是加锁+等待时间/事件条件触发解锁）
3. wait

#### 函数调用

函数调用可以形成stack，stack中会保存执行上下文(Execution Context)，执行语句的所有信息都在这个stack里保存，这个stack也就是执行上下文栈(Execution Context Stack)。当前执行的语句会对应栈的栈顶元素，栈顶元素即为当前可以访问的所有变量(Running Execution Context)。

**Execution Context**的构成为七个部分(不全部同时存在)：

- code evaluation state：代码执行状态

- Function：由function初始化的Execution Context才会有

- script or module：模块或者脚本里面的代码

- Generator：仅generator函数需要，具体指generator函数执行时隐藏的Generator

- realm：保存所有内置对象的域

- LexicalEnvironment：

  保存变量，使用var声明变量时会用到，但大部分情况与VariableEnvironment重合

- VariableEnvironment：

  this，new.target，super，变量都保存于此

**environment record**：

分类如下：

- Declarative
  - function
  - module
- Global
- Object

**闭包closure**：

分为代码和环境两部分，环境部分由一个Object和一个变量的序列构成。

闭包会保存代码内部的变量使用，箭头函数还会保存this

闭包时保证environment records能形成链的关键。

**realm**:

一个javaScript的引擎的实例里，所有的内置对象会被放入realm中。

例如：js中函数表达式和对象直接量会创建对象，使用.做隐式转换也会创建对象。没有realm则无法获知以上两种情况的产生的对象的原型。

