Moye (知心组件库)
=====================

`Moye` 是 ECOM UI 1.1 规范的一个轻量级实现。

[![Build Status](https://travis-ci.org/ecomfe/moye.png?branch=master)](https://travis-ci.org/ecomfe/Moye) [![devDependency Status](https://david-dm.org/ecomfe/moye/dev-status.png)](https://david-dm.org/ecomfe/moye#info=devDependencies)


### 如何使用

前期准备：

`git`、`nodejs`、`grunt-cli` 与 `edp`

获取源码：

	$ git clone git://github.com/ecomfe/moye.git
	$ cd moye

安装依赖：

	$ npm install

生成 API 文档：

	$ grunt jsdoc
    $ open doc/api/index.html

单元测试：

	$ grunt test

或者：
    
    $ edp test

代码覆盖率：

	$ grunt cover
	$ open test/coverage/ui/index.html

或者：
    
    $ edp test

查看可用任务：

	$ grunt --help
	

### 目前实现的组件

- 农历控件 [Lunar](http://ecomfe.github.io/moye/example/Lunar.html)
- 日历控件 [Calendar](http://ecomfe.github.io/moye/example/Calendar.html)
- 日历扩展 [CalendarExtension](http://ecomfe.github.io/moye/example/CalendarExtension.html)
- 城市选择 [City](http://ecomfe.github.io/moye/example/City.html)
- 分页控件 [Pager](http://ecomfe.github.io/moye/example/Pager.html)
- 浮层提示 [Tip](http://ecomfe.github.io/moye/example/Tip.html)
- 点击统计 [Log](http://ecomfe.github.io/moye/example/log.html)
- 条件过滤 [Filter](http://ecomfe.github.io/moye/example/Filter.html)
- 下拉选项 [Select](http://ecomfe.github.io/moye/example/Select.html)
- 延迟加载 [Lazy](http://ecomfe.github.io/moye/example/Lazy.html)
- 选 项 卡 [Tabs](http://ecomfe.github.io/moye/example/Tabs.html)
- 对 话 框 [Dialog](http://ecomfe.github.io/moye/example/Dialog.html)
- 浮动提示 [FloatTip](http://ecomfe.github.io/moye/example/FloatTip.html)
- 图片上传 [PicUploader](http://ecomfe.github.io/moye/example/PicUploader.html)
- 星号评级 [Rating](http://ecomfe.github.io/moye/example/Rating.html)
- 滚 动 条 [ScrollBar](http://ecomfe.github.io/moye/example/ScrollBar.html)
- 图片轮播 [Slider](http://ecomfe.github.io/moye/example/Slider.html)
