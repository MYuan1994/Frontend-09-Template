# 第十五周——*手势与动画*

## 动画

### 帧

> 帧——就是影像动画中最小单位的单幅影像画面，相当于电影胶片上的每一格镜头。 一帧就是一幅静止的画面，连续的帧就形成动画。 通常说的[帧数](https://baike.baidu.com/item/帧数/8019296)，简单地说，就是在1秒钟时间里传输的图片的帧数，也可以理解为[图形处理器](https://baike.baidu.com/item/图形处理器/8694767)每秒钟能够刷新几次，通常用[fps](https://baike.baidu.com/item/fps/3227416)（Frames Per Second）表示。每一帧都是静止的图象，快速连续地显示帧便形成了运动的假象。高的帧率可以得到更流畅、更逼真的动画。每秒钟帧数 (fps) 愈多，所显示的动作就会愈流畅。

实现动画最基础的就是每帧所做的事情。

Javascript中实现帧的方法：

1. setInterval()：

   普通人人眼放松时的可视帧数是24帧，过低时画面可能会出现运动模糊；因为视觉残留，人眼集中时最高可分辨帧数大概为30帧，在此帧数以上画面基本是流畅的，但更高的帧数可以带来更平滑的过渡，从而带来更丝滑的视觉体验。正常电影电视使用的帧率是每秒60帧。对应时长大概为16毫秒。

   16毫秒可能不会严格执行，内部函数设计问题可能使setInterval()发生积压。以下两种方法相对安全。

2. setTimeout():

   执行自身，实现后同上。

   ```javascript
   let tick=()=>{
   	setTimeout(tick,16);
   }
   ```

3. requestAnimationFrame()

   与浏览器帧率相关，意为：浏览器执行下一帧时所作的处理。

   ```javascript
   let tick=()=>{
   	let handler=requestAnimationFrame(tick);
       cancelAnimationFrame(handler);//销毁，释放资源
   }
   ```

## 手势

手势(gesture)与点击

- 鼠标点击的三个过程：mousedown ，mousemove ，mouseup

  过程平稳，几乎不会有抖动。

- 触屏手势的三个过程：touchstart，touchmove ，touchend

  手指的柔软会使触屏时发生偏移。手势会有多指操作。

### 手势区分

1. 首先第一步都是手指按下start
2. 分几种情况：
   - tap：手指按下后立即结束，视为轻点，约等于click点击事件
   - pan-start：假设有轻微的移动，Retina将以10px为限区分是否是真正的移动（一倍屏以5px区分，三倍屏以15px为区分），若认定为移动，则触发pan-start
3. 在触发pan-start后，每次move都触发pan事件，其中pan事件是一种持续状态。
4. pan状态结束时进入pan-end状态。
5. 如果在end时达到一定速度，触发flick事件，约等于扫一下swipe。
6. 长按时有0.5s的判定界限，多于此时间结束视为press start，事件监听多设于此事件上；若在此事件之上进行了移动（且超过对应倍屏的界限），则视为触发pan start；否则仅仅是结束按压，则触发pan end事件。

### 鼠标事件

因为事件的触发不止一种，用全局变量来判断事件的状态是不可取的，其中可能产生复杂情况的条件有：

1. touch多指事件
2. 鼠标有左右中键，复杂的甚至有更多如上下翻页等

而每种事件的触发我们都需要单独管理。

#### 标识

touch事件以event.identifier为唯一标识，为不同次触屏的context

鼠标事件以event.button作为唯一标识，为不同按键的context；在移动事件触发时，实际event.button并不能获取原有的开始点击，需要取event.buttons 的值判断，

event.buttons使用掩码表示按键情况，计算时使用按位计算

### 判断flick

move判断速度时需要取一段时间之内足够数量个点间的速度然后求平均值。像素每毫秒的值以1.5为区分。