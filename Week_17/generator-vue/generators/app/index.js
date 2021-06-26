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
        "test": "echo \"Error: no test specified\" && exit 1"
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
    // this.npmInstall(["webpack", "vue-loader","vue-style-loader","vue-template-compiler","css-loader","copy-webpack-plugin"], { 'save-dev': true });
    this.npmInstall(["css-loader","vue-style-loader"], { 'save-dev': true });

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
