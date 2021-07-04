var Generator = require('yeoman-generator');

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts);
  }


  async initPackage() {

    const packageSet = await this.prompt([
      {
        type: "input",
        name: "projectName",
        message: "Please input your project name",
        default: this.appname 
      }
    ]);

    const pkgJson = {

      "name": packageSet.projectName,
      "version": "1.0.0",
      "description": "",
      "main": "generators/app/index.js",
      "scripts": {
        "build": "webpack",
        "test": "mocha --require @babel/register",
        "coverage": "nyc mocha --require @babel/register",
      },
      "author": "zmy",
      "license": "ISC",
      "devDependencies": {
        "vue-loader": "^15.0.0",
        "vue-template-compiler": "^2.6.12",
        "webpack": "^4.46.0",
        "copy-webpack-plugin":"^6.0.0"
      },
      "dependencies": {
        "vue":"^2.6.12"
      }
    };

    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);

    // this.npmInstall("vue", { 'save-dev': false });

    this.npmInstall([
      // "copy-webpack-plugin",
      // "webpack",
      // "vue-template-compiler",
      // "vue-loader",
      "webpack-cli",
      "css-loader",
      "vue-style-loader",
      "babel-loader",
      "babel-plugin-istanbul",
      "@istanbuljs/nyc-config-babel",
      "@babel/core",
      "@babel/preset-env",
      "@babel/register",
      "mocha",
      "nyc"
    ], { 'save-dev': true });

    this.fs.copyTpl(
      this.templatePath('sample-test.js'),
      this.destinationPath('test/sample-test.js'),
      {}
    );
    this.fs.copyTpl(
      this.templatePath('.babelrc'),
      this.destinationPath('.babelrc'),
      {}
    );
    this.fs.copyTpl(
      this.templatePath('.nycrc'),
      this.destinationPath('.nycrc'),
      {}
    );


    this.fs.copyTpl(
      this.templatePath('HelloWorld.vue'),
      this.destinationPath('src/HelloWorld.vue'),
    );
    this.fs.copyTpl(
      this.templatePath('webpack.config.js'),
      this.destinationPath('webpack.config.js'),
    );
    this.fs.copyTpl(
      this.templatePath('main.js'),
      this.destinationPath('src/main.js'),
    );
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('src/index.html'),
      { title: packageSet.projectName }
    );

  }






};
