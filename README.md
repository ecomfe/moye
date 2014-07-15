Moye (知心组件库)
=====================

### jquery 分支 ###

此分支依赖于jquery，以下控件有相应的调整；

1. lib

以下方法由于没有被控件使用被移除
+ contains 
+ map/array.map
+ forIn/object.forIn
+ pad

以下方法由jquery相应的方法替代而被移除
+ typeOf 由$.type替代
+ isArray 由$.isArray替代
+ isFunctoin 由$.isFunction替代
+ each/array.each 由$.each替代
+ indexOf/array.indexOf 由$.inArray替代
+ toArray 由$.makeArray替代
+ extend/object.extend 由$.extend替代
+ parse 由$.parseJSON替代
+ trim 由$.trim替代
+ camelCase 由$.camelCase替代
+ bind/fn.bind 由$.proxy替代
+ on/event.on() 由$.on替代
+ un/event.un() 由$.off替代
+ fire()/event.fire() 由$('selector').trigger() 替代
+ lib.getTarget() 由于on方法由jquery管理而jquery所管理的事件会自动做兼容处理，因此移除
+ preventDefault() 由于on方法由jquery管理而jquery所管理的事件会自动做兼容处理，因此移除
+ stopPropagation() 由于on方法由jquery管理而jquery所管理的事件会自动做兼容处理，因此移除
+ setStyles()/dom.setStyles() 由jquery.css替代
+ page.getScrollLeft() 由$(window).scrollLeft()替代
+ page.getScrollTop() 由$(window).scrollTop()替代
+ page.getViewWidth() 由$(window).width()替代
+ page.getViewHeight() 由$(window).height()替代
+ dom下所有相关方法 由jquery中dom相关方法替代

以下方法被保留，但交由jquery实现
+ isObject 由$.type来实现
+ isDate 由$.type来实现
+ isString 由$.type来实现
+ clone/object.clone 由$.extend实现

由于jquery不能提供当前功能，以下方法保留
+ slice/array.slice
+ stringify
+ toQueryString
+ capitalize
+ pad
+ binds
+ curry
+ newClass
+ observable
+ configurable
+ fire/event.fire
+ browser
    

### 目前组件重构进度

- [x] lib     清理完成
- [x] 农历控件 [Lunar](http://ecomfe.github.io/moye/example/Lunar.html)
- [x] 日历控件 [Calendar](http://ecomfe.github.io/moye/example/Calendar.html)
- [ ] 日历扩展 [CalendarExtension](http://ecomfe.github.io/moye/example/CalendarExtension.html)
- [x] 城市选择 [City](http://ecomfe.github.io/moye/example/City.html)
- [ ] 分页控件 [Pager](http://ecomfe.github.io/moye/example/Pager.html)
- [ ] 浮层提示 [Tip](http://ecomfe.github.io/moye/example/Tip.html)
- [x] 点击统计 [Log](http://ecomfe.github.io/moye/example/log.html)
- [x] 条件过滤 [Filter](http://ecomfe.github.io/moye/example/Filter.html)
    1. 现在我们不再默认第一个选项为`全部`了，而是通过`label`上的data-all属性来识别。使用者可以在`options`中通过配置属性`allTag`来调整`data-all`，换成任意别的标签，比如`data-some-tag`;
    2. 现在选中`全部`在调用`getData()`时会在返回值中会包含所有的选项值，而不是空数组了。
- [ ] 下拉选项 [Select](http://ecomfe.github.io/moye/example/Select.html)
- [ ] 延迟加载 [Lazy](http://ecomfe.github.io/moye/example/Lazy.html)
- [ ] 选 项 卡 [Tabs](http://ecomfe.github.io/moye/example/Tabs.html)
- [ ] 对 话 框 [Dialog](http://ecomfe.github.io/moye/example/Dialog.html)
- [ ] 浮动提示 [FloatTip](http://ecomfe.github.io/moye/example/FloatTip.html)
- [ ] 图片上传 [PicUploader](http://ecomfe.github.io/moye/example/PicUploader.html)
- [ ] 星号评级 [Rating](http://ecomfe.github.io/moye/example/Rating.html)
- [ ] 滚 动 条 [ScrollBar](http://ecomfe.github.io/moye/example/ScrollBar.html)
- [ ] 图片轮播 [Slider](http://ecomfe.github.io/moye/example/Slider.html)
- [x] 浮出层
