# 第十周

## 课程内容

### 排版

循环处理每一个flex容器，每个容器的处理步骤：

1. 将容器内所有flex项目收集进**行内**，为方便后续计算项目的位置
   - 根据主轴尺寸，把元素分进行内
   - 若设置了no-wrap, 则强行分配进第一行
2. 计算每个flex项目的主轴尺寸
   - 找出所有flex元素，把剩余尺寸按比例分配给这些元素
   - 若剩余空间为负数，所有flex元素为0，等比压缩剩余元素
3. 计算每个flex项目的交叉轴尺寸
   - 计算行高（依据行内最“高”的元素）
   - 依据项目单独设置或者继承容器的项目对齐方式（应有6种，缺失了baseline与auto的处理），确定元素位置

### 渲染

单个element渲染：

- 绘制需要依赖图形环境，选用 images库
- 绘制需在viewport上进行
- 与绘制相关的属性：background-color等

完整DOM树的调用：

- 利用元素间父子关系，从根递归调用渲染单个元素的方法，即可完成完整渲染

## 扩展笔记

### 基础框盒模型

依赖display、float和position实现

> **basic box model**：将所有元素表示为一个个矩形的盒子（box），由CSS 决定这些盒子的大小、位置以及属性（例如颜色、背景、边框尺寸…）。
>
> 每个盒子由四个部分（或称*区域*）组成，其效用由它们各自的边界（Edge）所定义（原文：defined by their respective edges，意指容纳、包含、限制等）。
>
> ![CSS Box model](https://mdn.mozillademos.org/files/8685/boxmodel-(3).png)
>
> 如图，与盒子的四个组成区域相对应，每个盒子有四个边界：
>
> 1. 内容边界 `Content edge`：由内容边界限制，容纳着元素的“真实”内容；尺寸为内容宽度和内容高度，通常含有一个背景颜色（默认颜色为透明）或背景图像。
>
>    若box-sizing为content-box，则内容区域可通过width、min-width、max-width、height、min-height、max-height控制大小。
>
> 2. 内边距边界 `Padding Edge`：由内边距边界限制，扩展自内容区域，负责延伸内容区域的背景，填充元素中内容与边框的间距。它的尺寸是 *padding-box 宽度* 和 *padding-box 高度*。（padding）
>
> 3. 边框边界 `Border Edge`：由边框边界限制，扩展自内边距区域，是容纳边框的区域。其尺寸为 *border-box 宽度* 和 *border-box 高度*。(border)
>
> 4. 外边框边界 `Margin Edge`：由外边距边界限制，用空白区域扩展边框区域，以分开相邻的元素。它的尺寸为 *margin-box 宽度* 和 *margin-box 高度*。(margin)

### Flex布局

框盒模型对于解决**垂直居中问题**不是一个好选择，使用09年w3c推出的Flex则较易实现。

#### 概念

采用 Flex 布局的元素，称为 Flex 容器（flex container），简称`"容器"`。它的所有子元素自动成为容器成员，称为 Flex 项目（flex item），简称`"项目"`。

![](https://github.com/MYuan1994/Frontend-09-Template/tree/main/Week_10/img/flex_01.png)

容器默认存在两根轴：水平的主轴（main axis）和垂直的交叉轴（cross axis）。主轴的开始位置（与边框的交叉点）叫做`main start`，结束位置叫做`main end`；交叉轴的开始位置叫做`cross start`，结束位置叫做`cross end`。

项目默认沿主轴排列。单个项目占据的主轴空间叫做`main size`，占据的交叉轴空间叫做`cross size`。

#### 容器

容器支持设置的属性

1. flex-direction：描述主轴的方向，即项目的延伸方向

   取值范围：

   - `row`（默认值）：主轴为水平方向，起点在左端。
   - `row-reverse`：主轴为水平方向，起点在右端。
   - `column`：主轴为垂直方向，起点在上端。
   - `column-reverse`：主轴为垂直方向，起点在下端。

2. flex-wrap：主轴方向上项目排布空间不足时换行方式

   取值范围：

   - `nowrap`（默认）：不换行。
   - `wrap`：换行，新行顺交叉轴方向后延。
   - `wrap-reverse`：换行，新行逆交叉轴方向前置。

3. flex-flow：`flex-direction`属性和`flex-wrap`属性的简写形式

4. justify-content：项目在主轴上的对齐方式

   取值范围：

   - `flex-start`（默认值）：左对齐（行首对齐）
   - `flex-end`：右对齐（行尾对齐）
   - `center`： 居中
   - `space-between`：两端对齐，项目之间的间隔都相等。
   - `space-around`：每个项目两侧的间隔相等。

5. align-items：项目在交叉轴上的对齐方式

   取值范围：

   - `flex-start`：交叉轴的起点对齐。
   - `flex-end`：交叉轴的终点对齐。
   - `center`：交叉轴的中点对齐。
   - `baseline`: 项目的第一行文字的基线对齐。
   - `stretch`（默认值）：如果项目未设置高度或设为auto，将占满整个容器的高度。

6. align-content：若容器中有`多轴线`（可理解为多行/多列）排布时的对齐方式（轴线仅有一根则不生效）

   取值范围：

   - `flex-start`：与交叉轴的起点对齐。
   - `flex-end`：与交叉轴的终点对齐。
   - `center`：与交叉轴的中点对齐。
   - `space-between`：与交叉轴两端对齐，轴线之间的间隔平均分布。
   - `space-around`：每根轴线两侧的间隔都相等。所以，轴线之间的间隔比轴线与边框的间隔大一倍。
   - `stretch`（默认值）：轴线占满整个交叉轴。

#### 项目

项目支持设置的属性

1. order：项目的排列顺序。数值越小，排列越靠前，默认为0；可取值负数。

2. flex-grow：项目的放大比例，默认为0，即如果存在剩余空间，也不放大。

3. flex-shrink：项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。

   如果所有项目的`flex-shrink`属性都为1，当空间不足时，都将等比例缩小。如果一个项目的`flex-shrink`属性为0，其他项目都为1，则空间不足时，前者不缩小。

4. flex-basis：在分配多余空间之前，项目占据的主轴空间（main size）。

   浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为`auto`，即项目的本来大小。

   可设置固定的px为单位的属性值，占固定大小的空间。

5. flex：`flex-grow`, `flex-shrink` 和 `flex-basis`的简写，默认值为`0 1 auto`。后两个属性可选。

   ```css
   .item {
     flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]
   }
   ```

   建议优先使用这个属性，而不是单独写三个分离的属性，因为浏览器会推算相关值。

6. align-self：允许单个项目有与其他项目不一样的对齐方式，可覆盖`align-items`属性。

   默认值为`auto`，表示继承父元素的`align-items`属性，如果没有父元素，则等同于`stretch`。

### grid布局

Flex 布局是轴线布局，只能指定"项目"针对轴线的位置，可以看作是**一维布局**。Grid 布局则是将容器划分成"行"和"列"，产生单元格，然后指定"项目所在"的单元格，可以看作是**二维布局**。Grid 布局远比 Flex 布局强大。

相对应的，grid的定义和概念也更多：

1. `容器&项目`：采用网格布局的区域，称为"容器"（container）。容器内部采用网格定位的子元素，称为"项目"（item）。
2. `行&列`：容器里面的水平区域称为"行"（row），垂直区域称为"列"（column）。
3. `单元格`：行和列的交叉区域，称为"单元格"（cell）。
4. `网格线`：划分网格的线，称为"网格线"（grid line）。水平网格线划分出行，垂直网格线划分出列。

## 踩坑与手记

1. images库需要依赖c++环境，需要电脑有对应版本的vs，且需要重新编译：node-gyp rebuild images

2. 关于node-gyp：

   GYP是一种构建自动化工具。

   node-gyp：node下的gyp。

   为什么要有node-gyp？

   npm 为了方便干脆就直接源码分发，用户装的时候再现场编译。

   因为node程序中需要调用一些其他语言编写的 工具 甚至是dll，需要先编译一下，否则就会有`跨平台`的问题，例如在windows上运行的软件copy到mac上就不能用了，但是如果源码支持，编译一下，在mac上还是可以用的。node-gyp在较新的Node版本中都是自带的（平台相关），用来编译原生C++模块。

3. winter老师的基本实现：🍸[spritejs ](https://github.com/spritejs/sprite-core/commit/8757b4d3888b4f237b1089e94e075ab58ca952a6#diff-677d382da9f8d81f61d50af24f937b32R32 )

4. CSS 三大经典问题：垂直居中问题，两列等高问题，自适应宽问题。

5. React Native 则更为大胆地使用了纯粹的 Flex 排版，不再支持正常流

6. 使用flex后，容器中的项目的`float`、`clear`和`vertical-align`属性将失效

7. > flex 项如果有 flex 属性，会根据 flex 方向代替宽 / 高属性，形成“填补剩余尺寸”的特性，这是一种典型的“根据外部容器决定内部尺寸”的思路，也是我们最常用的 Windows 和 Apple 窗口系统的设计思路。

8. CSS布局演变：

   1. 正常流-框盒模型
   2. flex弹性布局
   3. grid网格
   4. css houding：https://www.smashingmagazine.com/2016/03/houdini-maybe-the-most-exciting-development-in-css-youve-never-heard-of/

## TODOLIST

- [ ] 了解css houding API
- [x] 了解grid（😅看完了，但笔记没补充）
- [x] 完成flex的笔记
- [ ] 将images替换为其他视图API
- [ ] 实现视图更新

   
