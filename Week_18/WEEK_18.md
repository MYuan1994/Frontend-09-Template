# 第十八周____工具链(二)

## 单元测试

### 测试工具 Mocha

**分类**：单元测试工具

#### 使用步骤

1. 安装

   ```shell
   $ npm install --global mocha
   #或
   $ npm install --save-dev mocha
   ```

2. 编写单元测试

   ```javascript
   var assert = require('assert');
   //引入索要测试的文件
   let functionName = require('../functionFile.js');
   
   //可以套多层describe,用于多次测试的分组和形成目录
   describe('Array', function() {
      //可写多个assert
      it('描述测试内容', function() {
         //assert('执行方法','预期结果')
         assert.equal(functionName('方法执行'),''预期结果');
       });
   });
   ```

3. 执行测试

   ```shell
   $ mocha
   ```

   如果需测试方法中没有使用module.exports导出，而使用export导出、单元测试编写时使用import引入，为解决mocha中使用node模块的问题，需要引入babel解决问题，首先需要安装@babel/core和@babel/register，然后在原命令改写为：`$ mocha --require @babel/register`

   ````shell
   $ ./node_modules/.bin/mocha --require @babel/register
   ````

   可以直接执行命令，也可以将命令配置在package.json中。
   
   由于没有指定babel转换的目标版本，所以需要新增`.babelrc`文件并写入：
   
   ```json
   {
       "presets": ["@babel/preset-env"]
   }
   ```

### Code Coverage

**Code Coverage**表示测试覆盖了原文件中哪些代码。自然状态下mocha无法完成覆盖率计算，需要依赖其他工具。

#### 覆盖率统计工具 nyc

##### 介绍

nyc属于工具集系列**istanbuljs**，是istanbuljs的命令行工具

##### 使用

1. 安装：`npm install --save-dev nyc`
2. 运行：在命令前添加nyc，如之前的单元测试命令改为`nyc ./node_modules/.bin/mocha --require @babel/register`，若之前在package.json配置了命令，使用`nyc npm run test`即可运行。

##### 配合Babel使用

nyc与babel互相加插件

1. 分别安装两个插件：**babel-plugin-istanbul**和**@istanbuljs/nyc-config-babel**

2. 更改配置文件：

   **.babelrc**添加配置：

   ```json
   {
       "presets": ["@babel/preset-env"],
       "plugins": ["istanbul"]
   }
   ```

   **.nycrc**添加配置：

   ```json
   {
       "extends": "@istanbuljs/nyc-config-babel"
   }
   ```

## 手记

- coverage相关工具是单元测试部分的重点，不同单元测试工具使用基本无出入

- nyc安装问题：按照课程中使用`--save-dev`安装的nyc，在命令行使用nyc时，可能会出现下图错误（或因Windows的vscode创建了工作区才有，未验证），需要在环境变量中添加安装的路径到path，或者使用全局安装nyc。

  ![](.\img\nyc_error.png)

- nyc的代码覆盖率统计结果中，行覆盖率较为重要

- 工具链的构造需要尽可能覆盖整个开发流程的每一步，简化操作命令，以在形成后开发人员仅需要输入简单命令为目标，需要覆盖的步骤有：

  - 初始化项目
  - 运行和调试
  - 单元测试
  - 发布

- 结合以上步骤，对于工具链可以分为四部分：

  - 脚手架：初始化项目，生成特定的项目模板。对应框架中的react的create-react-app和vue的vue-cli，脚手架依赖于gennerator创建，对应此次使用的**Yeoman**，其中文件模板系统和依赖系统为创建项目的重要功能。
  - 构建工具：除了初始化后的开发，build还需要为发布部分服务，因此build一般是独立的，常见的build工具也是本次使用的**webpack**，除此以外grunt和gulp也较为常用，但是webpack相对活跃的社区让它比其他两个更有吸引力，另外webpack支持插件、配置也灵活，因此对于不同的框架，webpack的使用几乎是不受限的。
  - 测试工具：此次使用了**mocha**，单元测试工具主要是简单使用，同类工具的使用难易程度、操作方式出入不大；另外编写的单元测试需要保证代码覆盖率，因此还需要使用对应的代码覆盖率统计工具，此次使用的是**nyc**。
  - 发布系统：除了课程中使用的部分，发布系统也有较大难度，复杂度在于开发的系统的组成结构打包格式都不尽相同，且系统发布运行的平台也有不同，个人经历来看系统发布没有统一工具，一般都需要进行独立的发布系统的开发，其中脚本的编写对前端来说是难点。



