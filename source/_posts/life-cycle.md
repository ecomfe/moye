title: 生命周期 / life cycle
categories:
  - introduction
date: 2015-08-07 16:29:55
---

# moye 生命周期机制

控件从被创意到被销毁，有一个完整的生命周期。目前`moye`控件的生命周期机制是这样的：

1. `NEW` 实例刚刚被创建
2. `INITED` 实例参数已完成初始化
3. `RENDERED` 实例已完成渲染
4. `DISPOSED` 实例已经被销毁

控件生命周期状态的流转是在`Control`基类中完成以下方法中完成的

1. `Control.prototype.initialize`: `NEW` -> `INITED`
2. `Control.prototype.render`: `INITED` -> `RENDERED`
3. `Control.prototype.dispose`: `RENDERED` -> `DISPOSED`

因此，我们可以总结出，以下接口的调用时机：

1. `Control.prototype.init` 在`NEW`状态下被调用，只应该被调用一次；
2. `Control.prototype.initStructure`与`Control.prototype.initEvents` 在`INITED`状态下被调用，只应该被调用一次；
3. `Control.prototype.repaint` 在`RENDERED`状态下被调用，可以被重复调用多次；
4. `Control.prototype.dispose` 在`RENDERED`状态下被调用，只应该被调用一次；
