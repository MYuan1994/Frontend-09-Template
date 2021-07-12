# 第十九周

## 初始化server

ubuntu系统初始化完毕后，使用包管理器apt安装node和npm

```shell
apt install nodejs	//npm或其他任何被apt管理的包
```

一般需要超级用户权限，命令需使用sudo

node版本管理库n，基本命令：

- 安装

  ```shell
  npm install -g n
  ```

- 使用n安装最新库

  ```shell
  n latest
  ```

可能需要重置path使生效，命令：

```shell
PATH="$PATH"
```

## Express编写服务器

### 初始化express服务端

远程初始化：

```shell
npx express-generator
```

初始化后项目使用jade模板。

初始化后的express无需其他配置就可以直接启动，网络、端口的配置可以在bin下的www修改，端口修改格式是：

```javascript
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
```

### 部署express服务端

linux操作（其他常用操作列于手记中）：

启用远程ssh服务，默认会在22端口监听：

```shell
service ssh start
```

scp远程复制，命令格式为：

在虚拟机及主机进行scp时，除了需要开启ssh服务，还需要在虚拟机软件上进行端口转发的配置（端口转发在开放应用访问地址时也需要设置）。

## 手记

- 更换镜像地址以让系统更快

  地址：http://mirrors.aliyun.com/ubuntu


## 旧笔记

内容大致覆盖了node的基本内容

nodeJS是运行在服务器端的JavaScript环境，与浏览器端相比，区别在于：

1. 没有浏览器端的安全限制
2. 服务器端程序需要具备`接受网络请求`、`读写文件`、`处理二进制内容`的能力

依据`typeof(window)`是否是undefined，判断是浏览器环境还是node环境

### 常用对象

#### Global

区别于浏览器端的全局变量window，node服务端的全局变量是global，global的属性和方法也和window不同，在node环境中，使用`global.console`可直接获取console的所有方法。

#### Process

`process === global.process`代表当前Node.js进程，通过process 对象可以拿到很多信息，如：

- 版本：process.version
- 平台：process.platform
- 操作系统位数：process.arch
- 当前工作目录：process.cwd()
- 切换目录：process.chdir('/private/tmp')

JS是由事件驱动执行的单线程模型。Node.js不断执行响应事件的JavaScript函数，直到没有任何响应事件的函数时退出。

想要在下一次事件响应中执行代码，写作：

```javascript
process.nextTick(fun())
```

响应事件执行回调可写作：

```javascript
process.on('exit', function (code) {
    console.log('about to exit with code: ' + code);
});
```

#### 基本模块

##### FileSystem（FS）文件系统模块

###### 文件同步/异步读写

文件系统模块，负责文件的读写，提供了异步同步两种方式。

```javascript
var fs = require('fs');
//同步读文件，可用try，catch捕获异常
fs.readFileSync('sample.txt', 'utf-8' );
//异步读文件
fs.readFile('sample.png', function (err, data) {
    if (err) {
        console.log(err);
    } else {
        console.log(data.length + ' bytes');
    }
});
//同步写文件
let dataI="这是写入的内容……";
fs.writeFileSync('output.txt', dataI);
//异步写文件
//三个参数，文件路径、数据、回调函数；其中数据格式为String，则按utf-8写入文本文件，若为Buffer，则写入二进制文件；回调函数只关注成功与否，故仅接收一个报错信息的参数。
let dataI="这是写入的内容……";
fs.writeFile('output.txt', dataI, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('ok.');
    }
})
```

读取二进制文件不传入文件编码方式时，回调函数的data参数是一个Buffer对象，`Buffer`对象就是一个包含零个或任意个字节的数组，可与string互相转换：

String转Buffer：

```javascript
let buf=Buffer.from('str','utf-8');
```

Buffer转String：

```javascript
let str=buf.toString('utf-8');
```

###### stat文件/目录信息

通过`fs.stat('文件路径或名称','function(err,stat)')`可获取一个文件或者目录的详细信息，信息存储在stat对象中；

同步写法为`stat=statSync('文件路径或名称')`

##### Stream流处理

是一个仅在服务区端可用的模块。

##### stdin/stdout

标准输入流stdin与标准输出流stdout，流的特点是数据是有序的，而且必须依次读取，或者依次写入。使用流读写时，仅需打开一个对应的文件流stdin/stdout，在node中仅需要响应`流`的事件即可。

一般使用fs的createReadStream和createWriteStream，生成可写流stream.Writable或者可读流stream.Readable，然后进行读取事件响应的设置（读）或写入方法的调用（写），

读文件示例：

```javascript
var rs = fs.createReadStream('sample.txt', 'utf-8');
rs.on('data', function (chunk) {
    console.log('DATA:')
    console.log(chunk);
});
rs.on('end', function () {
    console.log('END');
});
rs.on('error', function (err) {
    console.log('ERROR: ' + err);
});
```

写文件示例：

```javascript
var ws1 = fs.createWriteStream('output1.txt', 'utf-8');
ws1.write('使用Stream写入文本数据...\n');
ws1.write('END.');
ws1.end();

var ws2 = fs.createWriteStream('output2.txt');
ws2.write(new Buffer('使用Stream写入二进制数据...\n', 'utf-8'));
ws2.write(new Buffer('END.', 'utf-8'));
ws2.end();
```

##### pipe

将`Readable`和`Writable`串起来后，输出流Readable中的数据会进入输入流Writable，这种操作称为pipe，写作：

```javascript
var rs = fs.createReadStream('sample.txt');
var ws = fs.createWriteStream('copied.txt');
rs.pipe(ws);
```

一般情况下，`Readable`数据读取完毕，触发end事件时，会自动关闭`Writable`，若不想关闭，使用pipe()需传入参数：

```javascript
rs.pipe(ws, { end: false });
```

#### HTTP(web服务器)

###### 没啥好写的

#### crypto

提供加密和哈希算法

##### MD5和SHA1

MD5是一种常用的哈希算法，用于给任意数据一个“签名”。这个签名通常用一个十六进制的字符串表示，写作：

```javascript
const crypto = require('crypto');
const hash = crypto.createHash('md5');

// 可任意多次调用update():
hash.update('Hello, world!');
hash.update('Hello, nodejs!');

console.log(hash.digest('hex')); // 7e1977739c748beac0c0fd14fd26a544
```

`update()`方法默认字符串编码为`UTF-8`，也可以传入Buffer。

line2的`md5`可替换为`SHA1`、`SHA256`、`SHA512`。

##### Hmac

Hmac也是一种哈希算法，也可以使用MD5等算法，但是它可以添加一个密钥，可看作加强的哈希算法，写作

```javascript
const hmac = crypto.createHmac('sha256', 'secret-key');
```

##### AES

以上为单向散列算法，加密后解密解出的不一定是加密前内容也可能是一个结果集，AES是一种对称加密算法，使用相同的密钥进行加解密，AES包含了数种算法可以使用，如`aes192`，`aes-128-ecb`，`aes-256-cbc`等，AES除了密钥外还可以指定IV（Initial Vector），不同的系统只要IV不同，用相同的密钥加密相同的数据得到的加密结果也是不同的。加密结果通常有两种表示方法：hex和base64，如果无法正确解密，要检查的内容是：

- 双方是否遵循同样的AES算法
- 字符串密钥是否相同
- IV是否相同
- 加密后的数据是否统一为hex或base64格式。

crypto模块使用AES需要自己封装好函数：

```javascript
const crypto = require('crypto');

function aesEncrypt(data, key) {
    const cipher = crypto.createCipher('aes192', key);
    var crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

function aesDecrypt(encrypted, key) {
    const decipher = crypto.createDecipher('aes192', key);
    var decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

var data = 'Hello, this is a secret message!';
var key = 'Password!';
var encrypted = aesEncrypt(data, key);
var decrypted = aesDecrypt(encrypted, key);

console.log('Plain text: ' + data);
console.log('Encrypted text: ' + encrypted);
console.log('Decrypted text: ' + decrypted);
```

##### Diffie-Hellman

##### RSA

##### 数字证书

### WEB模块

#### 开发框架Express与koa

##### Express

Express对HTTP做了进行了封装，用法写作：

```javascript
var express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
```

作为服务器端，为了性能业务等需求，异步的能力是服务端必备的，但express框架基于ES5语法，实现异步的方法只有使用回调，但是如此代码会十分丑陋。也可使用async库来组织代码，但是也属于事倍功半的做法。

##### koa

基于ES6中的generator编写，因此可依据generator实现异步，写法：

```javascript
var koa = require('koa');
var app = koa();

app.use('/test', function *() {
    yield doReadFile1();
    var data = yield doReadFile2();
    this.body = data;
});

app.listen(3000);
```

还可以使用`promise`或者`async await`

##### koa 2.0

基于ES7，koa2.0实现异步可以使用promise结合async实现

````javascript
app.use(async (ctx, next) => {
    await next();
    var data = await doReadFile();
    ctx.response.type = 'text/plain';
    ctx.response.body = data;
});
````

koa2.0不建议使用generator，因为在不需要保证兼容性的时候，将不再支持generator

##### 入门

使用koa2创建服务的代码写作：

````javascript
const Koa=require('koa')
const server = new Koa();

//ctx表示request和response的实体
//next表示即将处理的函数
server.use(async (ctx, next) => {
    await next();
    // 设置response的Content-Type:
    ctx.response.type = 'text/html';
    // 设置response内容
    ctx.response.body = '<h1>Hello, koa2!</h1>';
});

server.listen(3000);
console.log('server started at port 3000...');
````

###### koa middleware

koa可将多个async函数组成一条处理链，如下代码利用3个middleware组成处理链

```javascript
app.use(async (ctx, next) => {
    //do something……
    await next(); // 调用下一个middleware
     //do something……
});

app.use(async (ctx, next) => {
    const start = new Date().getTime(); // 当前时间
    await next(); // 调用下一个middleware
    const ms = new Date().getTime() - start; // 耗费时间
    console.log(`Time: ${ms}ms`); // 打印耗费时间
});

app.use(async (ctx, next) => {
    await next();
     //do something……
    ctx.response.type = 'text/html';
    ctx.response.body = '<h1>Hello, koa2!</h1>';
});
```

以上调用`app.use()`的顺序决定了middleware的顺序，由await next()延续直下一个middleware。

##### 处理URL

在以上代码中建立了基本的服务后，访问URL可以返回response，但是对于不同的url未进行相对应的处理，一种方法是对于多个`middleware`，依据`ctx.request.path`的值，分别做不同的处理，这样会形成一种链式判断，但这明显不是一种符合设计规范和人类直觉的处理方式，应有一个可以进行集中处理的`middleware`，以便让我们可以更专注于完成对不同url的处理逻辑

##### koa-router

可通过引入koa-router来处理url的映射，示例：

```javascript
const Koa = require('koa');
// 注意require('koa-router')返回的是函数:
//相当于：const fn_router = require('koa-router');	const router = fn_router();
const router = require('koa-router')();

server.use(async (ctx, next) => {
    await next();
});


router.get('/', async (ctx, next) => {
    ctx.response.body = '<h1>Index</h1>';
})

router.get('/user/:name', async (ctx, next) => {
    let name = ctx.params.name;
    ctx.response.body = `<h1>userName ${name}</h1>`;
})

server.use(router.routes());
```

##### 处理post

get处理完后，继续处理post类型请求。

post的特殊之处在于，一般会带有一个表单或者json，他们作为request的body发送，需要对这种request的body进行解析，做法是利用`koa-bodyparser`模块进行解析，在router之前将bodyParser注册到app

```javascript
const bodyParser = require('koa-bodyparser');
app.use(bodyParser());
```

##### 重构controller

将总体的index拆成多个模块，通过module.exports、扫描文件、controllers.js进行使用
