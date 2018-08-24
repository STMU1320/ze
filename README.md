# ZE
一个可视化图表的渲染引擎，目前还在进一步完善和优化中...

# Install
yarn | npm install zeg

or 

[download](https://stmu1320.github.io/ze/dist/ze.js)

# Use
```js
const canvas = new ZE.Canvas('container', {
  width: 800,
  height: 600,
  style: {
    fillStyle: 'red'
  }
})
```

# Examples
### [例子点击这里](https://github.com/STMU1320/ze/tree/master/demo)
### [预览点击这里](https://stmu1320.github.io/ze/demo/)

![Demo](https://stmu1320.github.io/ze/snapshot/home.png)

# Document

## 项目结构

* core文件夹存放项目主要类

* shapes文件夹存放基础图形

* utils存放工具函数

## 类的关系
* Canvas： 画板、绘图入口，所有Layer的容器。继承EventBus实现事件的订阅分发，代理原生的HTML事件以实现Canvas内各Shape的事件系统。

* Element： Layer和Shape的基类，主要实现各种属性的设置和动画等功能。

* Layer： 图层、组成画面的胶片。是Element的容器，和Canvas有部分相似的地方。

* Shape： 基础图形、构成画面的基本元素，各个基础图形的父类。

## 目前实现基础图形
* Arc 圆弧 主要用于绘制弧线

* Circle 圆 主要用于绘制圆形

* Ring 圆环 主要用于绘制环形

* Line 线条 主要用于绘制线段

* Bezier 贝塞尔曲线 主要用于绘制二次或者三次贝塞尔曲线

* Text 文字 主要用于绘制文本

* Polyline 折线 主要用于光滑或者有棱角的折线段

* Rect 矩形

* Polygon 多边形 主要用于绘制规则或者不规则的多边形

* Image 图片 主要用于绘制已有图片，来源可以是HTMLImageElement、HTMLCanvasElement或者图片url

* Video 视频 主要用于绘制视频，支持m3u8类型的视频源

## API和配置

### 事件相关
canvas、layer、shape共用，所有的事件都是由canvas负责管理的即使layer或者shape去分发订阅事件也只是代理canvas。

* addEventListener((type, func, [element, once]))添加订阅事件 (alias: on)<br/>
* removeEventListener((type, [element, func]))移除订阅事件 (alias: off)<br/>
* once((type, func, [element]))添加只执行一次的事件<br/>
* trigger((type, [element, ...data]))触发事件(alias: emit)<br/>

### 图形公用方法和属性（Layer和Shape）
##### 方法
* setAttrs(attr)设置属性(具体属性视具体shape而定)<br/>
* setStyle(style)设置样式<br/>
  ```js
  /* 可设置样式 */
  const STYLE_KEYS = [
    'fillStyle',
    'font',
    'globalAlpha',
    'lineCap',
    'lineWidth',
    'lineJoin',
    'miterLimit',
    'shadowBlur',
    'shadowColor',
    'shadowOffsetX',
    'shadowOffsetY',
    'strokeStyle',
    'textAlign',
    'textBaseline',
    'lineDash',
    'lineDashOffset',
    'fontSize',
    'fontStyle',
    'fontWeight',
    'fontVariant',
    'fontFamily'
    ];
  ```

* animate(options)设置动画 (默认设置后自动播放)<br/>
  ```js
  /* options说明 */
  {
    props: { x: 100 }, //attr或者style目标值
    duration: 1000, //动画时长
    effect: 'easeOut', // 缓动效果
    callback, // 动画结束回调
    frameEnd, // 每一帧结束回调
    delay, // 延时播放时长
    repeat, // 是否重复播放 start -> end
    loop, // 是否循环播放 start <-> end
    autoPlay, // 自动播放 默认动画设置后即开始计时播放
  }
  ```

* play() 播放动画<br/>
* stop() 停止动画<br/>
* update() 更新画面，更改属性或样式后需要update才会更新画布内容<br/>
* show() 显示图形<br/>
* hide() 隐藏图形<br/>
* destroy() 从画板中移除自己<br/>
* getCanvas() 获取画板容器<br/>
* getContext() 获取画笔<br/>
* getStatus() 返回图形当前状态<br/>

##### 属性
* attrs 图形相关配置<br/>
* style 图形相关样式<br/>
* type 图形类型<br/>
* zIndex 位置层级<br/>
* computed 根据图形样式和属性计算后得到的一些值<br/>
##### 实例化时通用配置
  ```js
  const layer = canvas.addLayer({
    attrs: {}, // opacity: 0~1, hasFill: true, hasStroke: false 为通用属性，其余属性参见下方图形和图层属性
    animate: {}, // 配置同animate方法
    style: {}, // 配置同setStyle方法
    visible: true, // 是否可见
    zIndex: 1, // 层级 默认 0
    event: {} // 响应的事件目前有click, dblclick, mousemove, mouseenter, mouseout, mousedown, mouseup
  });
  ```

### Canvas
* 配置
  
  container: 画板的容器，canvas渲染到html中的位置<br/>
  width: 画布宽度<br/>
  height: 画布高度<br/>
  style: 绘画的各种样式，具体设置项同原生API

* 主要方法

  draw() 绘制图形，必须调用一次才能将图形渲染到canvas。<br/>
  addLayer(options) 添加图层<br/>
  addShape(type, options) 添加图形<br/>
  remove(element) 移除图形或图层<br/>
  clear() 清除所有图层<br/>
  update() 更新画布<br/>

### Layer属性
* x 水平位置<br/>
* y 垂直位置<br/>

### Arc属性
* x 圆心水平位置<br/>
* y 圆心垂直位置<br/>
* r 半径<br/>
* start 开始角度<br/>
* angle 转动角度<br/>

### Circle属性
* x 圆心水平位置<br/>
* y 圆心垂直位置<br/>
* r 半径<br/>
* cw 顺时针或者逆时针开关 默认false(顺时针)<br/>

### Ring属性
* x 圆心水平位置<br/>
* y 圆心垂直位置<br/>
* outer 外圆半径<br/>
* inner 内圆半径<br/>
* start 开始角度<br/>
* angle 转动角度 默认360 即一周<br/>

### Line属性
* x1 起点x坐标<br/>
* y1 起点y坐标<br/>
* x2 终点x坐标<br/>
* y2 终点y坐标<br/>

### Bezier属性
* p 贝塞尔曲线的控制点([ { x, y }, {x, y} ])<br/>
* type 'quadratic' 二次方贝塞尔 'cubic' 三次方贝塞尔<br/>
>注意quadratic的控制点需为三个,cubic为4个。此外坐标的数据结构以后可能会调整为[ [x,y] ]

### Text属性
* x 文字x坐标<br/>
* y 文字y坐标<br/>
* text 要渲染的文本  可以是字符串或者字符串数组<br/>
* lineHeight 行高 多行文本时每行之间的间隔<br/>

### Polyline属性
* points 折线的端点 ([ [x, y], [x,y] ])<br/>
* smooth 平滑程度0~1 默认不平滑<br/>
* t 绘制长度与总长度的比值，主要用于做动画<br/>
* position true | false 是否根据t值计算当前折线的终点坐标<br/>

### Rect属性
* x 左上角x坐标<br/>
* y 左上角y坐标<br/>
* w 宽度<br/>
* h 高度<br/>
* radius 圆角半径<br/>
* cw 顺时针或者逆时针开关 默认false(顺时针)<br/>

### Polygon属性
* points 多边形的端点 ([ [x, y], [x,y] ])<br/>
* regular 是否为正多边形，如为true则忽略用户设置的points
* cw 顺时针或者逆时针开关 默认false(顺时针)<br/>
* x 正多边形中心x坐标<br/>
* y 正多边形中心y坐标<br/>
* r 正多边形半径<br/>
* vertices 多边形顶点数量 3~100<br/>
* angle 转动角度 -360 ~ 360 默认方向为-Y轴<br/>

### Image属性
* x 左上角x坐标<br/>
* y 左上角y坐标<br/>
* w 宽度<br/>
* h 高度<br/>
* img 图片源 HTMLImageElement、HTMLCanvasElement或者图片url<br/>

### Video属性
* x 左上角x坐标<br/>
* y 左上角y坐标<br/>
* w 宽度<br/>
* h 高度<br/>
* video 视频源 HTMLVideoElement或者视频url<br/>

>各个类以及图形都还在完善和调整中，可能会有部分错误和遗漏。

