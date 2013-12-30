Moye (知心组件库)
=====================

`Moye` 是 ECOM UI 1.1 规范的一个轻量级实现。

[![Build Status](https://travis-ci.org/ecomfe/Moye.png?branch=master)](https://travis-ci.org/ecomfe/Moye)


### 如何使用

前期准备：

`git`、`nodejs`、`grunt-cli` 与 `edp`

获取源码：

	git clone git://github.com/ecomfe/Moye.git
	cd Moye

安装依赖：

	npm install

生成文档：

	grunt jsdoc
    open doc/api/index.html

单元测试：

	grunt test

或者：
    
    edp test

代码覆盖率：

	grunt cover
	open test/coverage/ui/index.html

或者：
    
    edp test

查看可用任务：

	grunt --help
	

### 目前实现的组件

- 农历控件 [Lunar](http://ecomfe.github.io/Moye/example/Lunar.html)
- 日历控件 [Calendar](http://ecomfe.github.io/Moye/example/Calendar.html)
- 日历扩展 [CalendarExtension](http://ecomfe.github.io/Moye/example/CalendarExtension.html)
- 城市选择 [City](http://ecomfe.github.io/Moye/example/City.html)
- 分页控件 [Pager](http://ecomfe.github.io/Moye/example/Pager.html)
- 浮层提示 [Tip](http://ecomfe.github.io/Moye/example/Tip.html)
- 点击统计 [Log](http://ecomfe.github.io/Moye/example/log.html)
- 条件过滤 [Filter](http://ecomfe.github.io/Moye/example/Filter.html)
- 下拉选项 [Select](http://ecomfe.github.io/Moye/example/Select.html)
- 延迟加载 [Lazy](http://ecomfe.github.io/Moye/example/Lazy.html)
- 选 项 卡 [Tabs](http://ecomfe.github.io/Moye/example/Tabs.html)
- 对 话 框 [Dialog](http://ecomfe.github.io/Moye/example/Dialog.html)
- 浮动提示 [FloatTip](http://ecomfe.github.io/Moye/example/FloatTip.html)
- 图片上传 [PicUploader](http://ecomfe.github.io/Moye/example/PicUploader.html)
- 星号评级 [Rating](http://ecomfe.github.io/Moye/example/Rating.html)
