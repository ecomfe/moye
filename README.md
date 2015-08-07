# Moye-ng (知心组件库)
=====================

## 支持状态

> `disabled`/`readonly`/`valid`/`invalid`/`success`/`failure`...各种状态切换手动操作？NO!

`moye`支持状态切换，我们新增了以下方法，让你不再感到`状态`困扰！

+ `addState()`
+ `removeState()`
+ `hasState()`

## 支持皮肤

现在，我们可以不同的控件实例添加`皮肤`了！同一页面下的多个控件实例也可以有不同的表现形式，为复杂页面使用`moye`提供了可能性！

## 支持插件

> 控件功能太少又不能直接改`moye`？

`moye`开始支持`插件plugin`，激活控件潜能！快来写个插件支持一下！

> 控件功能太多体积太大？

`moye`通过`插件机制，逐步将控件的附加功能拆解成插件。抛弃用不上的，要你想要的，

## 全面基于`jquery`

由于百度大搜索页面中全面应用`jquery`，其他的各个产品线也在迁移到`jquery`，我们决定也使用`jquery`作为基础库。这可以减少`moye`整体代码量，也可以提供更好的易用性

`jquery`为我们提供了大量的基础方法，原有的`moye/lib`库中大量的基础函数被移除或者由`jquery`完成实现。以下是相应的调整；


+ `移除`下列方法
    - 由`jquery`提供的相应方法替代
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
    - 由于没有控件使用而，`移除`下列方法
        + contains 
        + map/array.map
        + forIn/object.forIn
        + pad
+ `保留`下些方法
    - 交由jquery实现
        + isObject 由$.type来实现
        + isDate 由$.type来实现
        + isString 由$.type来实现
        + isArray 由$.isArray实现
        + isFunctoin 由$.isFunction实现
        + clone/object.clone 由$.extend实现
    - 由于jquery不能提供当前功功能
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
    - 由于jquery调用方法不够简洁，以下方法保留
        + page.getScrollLeft()
        + page.getScrollTop()
        + page.getViewWidth()
        + page.getViewHeight()
    
## 更丰富的DEMO与API文档

我们花了大量精力重构了`moye`的demo。所有控件都有详细的代码示例和说明文档。

> 待补充demo地址

## 更多细节调整

1. Select
    1. 现在我们不再默认第一个选项为`全部`了，而是通过`label`上的data-all属性来识别。使用者可以在`options`中通过配置属性`allTag`来调整`data-all`，换成任意别的标签，比如`data-some-tag`;
    2. 现在选中`全部`在调用`getData()`时会在返回值中会包含所有的选项值，而不是空数组了。
2. Pager
    1. 现在`setPage()`和`setTotal()`方法会直接重绘控件，而不用再调用`render()`了