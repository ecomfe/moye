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
+ each/array.each 由$.each替代
+ indexOf/array.indexOf 由$.inArray替代
+ toArray 由$.makeArray替代
+ extend/object.extend 由$.extend替代
+ parse 由$.parseJSON替代
+ trim 由$.trim替代
+ toQueryString 由$.param替代
+ camelCase 由$.camelCase替代
+ bind/fn.bind 由$.proxy替代
+ on/event.on() 由$.on替代
+ un/event.un() 由$.off替代
+ fire()/event.fire() 由$('selector').trigger() 替代
+ lib.getTarget() 由于on方法由jquery管理而jquery所管理的事件会自动做兼容处理，因此移除
+ preventDefault() 由于on方法由jquery管理而jquery所管理的事件会自动做兼容处理，因此移除
+ stopPropagation() 由于on方法由jquery管理而jquery所管理的事件会自动做兼容处理，因此移除
+ setStyles()/dom.setStyles() 由jquery.css替代
+ dom下所有相关方法 由jquery中dom相关方法替代

以下方法被保留，但交由jquery实现
+ isObject 由$.type来实现
+ isDate 由$.type来实现
+ isString 由$.type来实现
+ isArray 由$.isArray实现
+ isFunctoin 由$.isFunction实现
+ clone/object.clone 由$.extend实现

由于jquery不能提供当前功能，以下方法保留
+ slice/array.slice
+ stringify
+ capitalize
+ pad
+ binds
+ curry
+ newClass
+ observable
+ configurable
+ fire/event.fire
+ browser

由于jquery调用方法不够简洁，以下方法保留
+ page.getScrollLeft()
+ page.getScrollTop()
+ page.getViewWidth()
+ page.getViewHeight()
    
## 其他变更

### Select

1. 现在我们不再默认第一个选项为`全部`了，而是通过`label`上的data-all属性来识别。使用者可以在`options`中通过配置属性`allTag`来调整`data-all`，换成任意别的标签，比如`data-some-tag`;
2. 现在选中`全部`在调用`getData()`时会在返回值中会包含所有的选项值，而不是空数组了。
