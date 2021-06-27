# 作业说明

1. 笔记在**WEEK_17.md**

2. 由于最新版Yeoman不再支持使用**npmInstall**或者**yarnInstall**，需回退版本，或者提前设置好package中依赖的版本。提交的作业里尝试了两种，1是将"yeoman-generator"回退了版本至"^4.8.0"，2是设置依赖版本为：

   - "vue-loader": "^15.0.0",

   - "vue-template-compiler": "^2.6.12",

   - "webpack": "^4.46.0",

   - "copy-webpack-plugin":"^6.0.0",

   - "vue":"^2.6.12"

     尝试中得知vue与vue-template-compiler的版本号一致，以及其他依赖间版本匹配关系。

3. webpack版本使用了本地原有的^4.46.0,如果本地webpack版本高于5.0.0,可能会报错。


