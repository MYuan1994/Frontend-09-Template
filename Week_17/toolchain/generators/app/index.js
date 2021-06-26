var Generator = require('yeoman-generator');

module.exports = class extends Generator {

  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    // Next, add your custom code
    //允许我们添加babel的flag
    // this.option('babel'); // This method adds support for a `--babel` flag
  }

  // // class中方法会顺次执行
  // async method1() {
  //     const answers = await this.prompt([
  //         {
  //           type: "input",
  //           name: "name",
  //           message: "Your project name",
  //           default: this.appname // Default to current folder name
  //         },
  //         {
  //           type: "confirm",
  //           name: "cool",
  //           message: "Would you like to enable the Cool feature?"
  //         }
  //       ]);

  //       this.log("app name", answers.name);
  //       this.log("cool feature", answers.cool);
  // }

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
    
    //npmInstall已被废弃？？？？
    // this.npmInstall()

  }

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




};
