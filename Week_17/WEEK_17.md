# 第十七周

所有工具的开端都是脚手架。

脚手架≠工具链

## Yeoman

社区热门脚手架生成器**Yeoman**，使用Yeoman可以开发出初始化项目、创建模板的工具。

### 功能

1. 命令行交互

   ```javascript
     async method1() {
         const answers = await this.prompt([
             {
               type: "input",//输入
               name: "name",
               message: "Your project name",
               default: this.appname // Default to current folder name
             },
             {
               type: "confirm",//选择是否
               name: "cool",
               message: "Would you like to enable the Cool feature?"
             }
           ]);
   
           this.log("app name", answers.name);
           this.log("cool feature", answers.cool);
     }
   ```

2. 文件系统：读写，模板解析

   ```javascript
   async writing() {
       const answers = await this.prompt([
         {
           type: "input",
           name: "title",
           message: "Your Html title",
           default: this.appname // Default to current folder name
         }
       ]);
       this.fs.copyTpl(
         this.templatePath('t.html'),
         this.destinationPath('public/index.html'),
         { title: answers.title }
       );
     }
   ```

3. 依赖系统

   ```javascript
     initPackage() {
       const pkgJson = {
         devDependencies: {
           eslint: '^3.15.0'
         },
         dependencies: {
           react: '^16.2.0'
         }
       };
   
       // Extend or create package.json file in destination path
       this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
       
       //npmInstall、yarnInstall似乎已被废弃？？？？
       // this.npmInstall()
   
     }
   ```

4. ……

## webpack

### **背景**

Build工具，最初是为node.js设计的打包工具，可以将node.js的代码打包成浏览器可用的代码，最初仅为js设计，未考虑HTML因素。后来出现的基于HTML的打包工具，配置上的要求低于webpack。

### 功能

多文件合并，合并过程中通过各种loader与plugin控制合并的规则和对文本进行转换。

### 依赖包

webpack的使用依赖两个包：

1. webpack：webpack除使用命令之外的部分，大部分项目使用webpack的时候会将webpack-cli部分从webpack的依赖中去掉
2. webpack-cli：webpack的命令，若使用webpack命令则必须安装。

这两个包一般全局安装使用，不需要打包进项目里。

### 组成部分介绍

#### Entry

入口，写作：

```javascript
module.exports={
	entry:'./~/~~.js'
    //……
}
```

webpack可以有多个入口，可以打包多个文件；但一次webpack的过程仅支持一个文件及其所有依赖文件的打包。

#### Output

设置输出文件和输出路径，写法是：

```javascript
output:{
	path:path.resolve(__dirname,'dist'),
	filename:"xxxx.js"
}
```

#### *Loader*

loader的使用是将一个source变成一个目标的代码

> loader 用于对模块的源代码进行转换。loader 可以使你在 `import` 或 "load(加载)" 模块时预处理文件。因此，loader 类似于其他构建工具中“任务(task)”，并提供了处理前端构建步骤的得力方式。

loader的使用有两种方式：

- [配置方式](https://webpack.docschina.org/concepts/loaders/#configuration)（推荐）：在 **webpack.config.js** 文件中指定 loader。

  对于一类文件，use可以为string从而预设一种loader，也可写作[String]指定多个loader，多个loader会从下至上执行

  在module的rules里配置，写作：

  ```javascript
  module:{
  	rules:[
  		//test：正则表达式，表示loader作用的文件的命名格式
  		//use：loader名称或loader对象，例如"css-loader"、"babel-loader"、"view-loader"等
  		{ test: /\.txt$/ , use:"row-loader" },
  		//……
  	]
  }
  ```

- [内联方式](https://webpack.docschina.org/concepts/loaders/#inline)：在每个 `import` 语句中显式指定 loader。

  可以在 `import` 语句或任何 [与 "import" 方法同等的引用方式](https://webpack.docschina.org/api/module-methods) 中指定 loader。使用 `!` 将资源中的 loader 分开。每个部分都会相对于当前目录解析。

  ```
  import Styles from 'style-loader!css-loader?modules!./styles.css';
  ```

  通过为内联 `import` 语句添加前缀，可以覆盖 [配置](https://webpack.docschina.org/configuration) 中的所有 loader, preLoader 和 postLoader：

  - 使用 `!` 前缀，将禁用所有已配置的 normal loader(普通 loader)

    ```js
    import Styles from '!style-loader!css-loader?modules!./styles.css';
    ```

  - 使用 `!!` 前缀，将禁用所有已配置的 loader（preLoader, loader, postLoader）

    ```js
    import Styles from '!!style-loader!css-loader?modules!./styles.css';
    ```

  - 使用 `-!` 前缀，将禁用所有已配置的 preLoader 和 loader，但是不禁用 postLoaders

    ```javascript
    import Styles from '-!style-loader!css-loader?modules!./styles.css';
    ```

#### plugin

除了基本的loader，若有loader解决不了的事情，需要使用plugin(插件)。

plugin是一个具有apply方法的对象，apply会被compiler(编译器)调用，并且在整个编译周期内都可以访问编译器对象

plugin示例：

```javascript
const pluginName = 'ConsoleLogOnBuildWebpackPlugin';

class ConsoleLogOnBuildWebpackPlugin {
  apply(compiler) {
    compiler.hooks.run.tap(pluginName, (compilation) => {
      console.log('webpack 构建过程开始！');
    });
  }
}

module.exports = ConsoleLogOnBuildWebpackPlugin;
```

使用plugin在配置时需要将plugin实例化，plugin接受一个实例new XXXXplugin(…args)或者实例队列[……new XXXXplugin(…args)]，写作：

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
const webpack = require('webpack'); // 访问内置的插件
const path = require('path');

//……

plugins: [
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({ template: './src/index.html' }),
  ]
```

## Babel

### 功能

将浏览器无法识别的新版本的js(或者Typescript)编译成浏览器可以识别的老版本的js。

### 依赖包

- @babel/core
- @babel/cli

### 配置

使用.babelrc进行配置是一种最普适的方法(以json形式将配置写入.babelrc，进行babel操作时会自动读取.babelrc配置)，写作：

```
{
	//使用时需要提前安装(preset-env，常用配置)
	"presets":["@babel/preset-env"]
}
```

### 使用

命令行用法：`babel XXXX.js`该方法会将文件内容输出到命令行，如果需要编译后内容输出，可使用系统的重定向输出

```shell
babel XXXX.js >YYY.txt
```

babel-loader用法：babel-loader不会默认读取.babelrc的配置，因此要在webpack中进行loader的配置，babel还需要配置options，写作：

```javascript
module:{
	rules:[
		{ 
			test: /\.js$/ ,
            use:{
            	loader:"babel-loader",
            	options:{
            		presets:["@babel/preset-env"],
            		//特殊插件
            		plugin:[
            			["@babel/plugin-transform-react-jsx",{pragma:"createElement"}]
            		]
            	}
            }
		},
		//……
	]
}
```

## 手记

- Yeoman中route为创建复杂generator。

- Yeoman会顺次执行class中的方法。

  ```javascript
  module.exports = class extends Generator {
  	constructor(args, opts) {
          // Calling the super constructor is important so our generator is correctly set up
          super(args, opts);
      
          // Next, add your custom code
          //允许我们添加babel的flag
          // this.option('babel'); // This method adds support for a `--babel` flag
      }
      method1(){……}
      method2(){……}
      method3(){……}
  }
  ```

- `this.option('babel');`允许我们添加babel的flag

- package.json中项目的名字需要以generator开始才可以被Yeoman运行起来。

- `npm link`可以将本地模块link到npm标准模块里，名字取决于package中设置的name

- npm查询依赖库的历史版本

  ```shell
  npm view <packagename> versions --json
  ```

- **<u>Yeoman中npmInstall似乎已被废弃，可以在依据上一条选择合适的版本写入package.json，或者安装旧版</u>**

  ```shell
  npm install yeoman-generator@4.8.0
  ```

- webpack.config.js：webpack配置文件，可以改变webpack命令的部分行为

- webpack中loader使用前需要先安装

- 如果在插件中使用了 [`webpack-sources`](https://github.com/webpack/webpack-sources) 的 package，请使用 `require('webpack').sources` 替代 `require('webpack-sources')`，以避免持久缓存的版本冲突

