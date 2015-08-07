title: 最佳实践 / best practice
categories:
  - introduction
date: 2015-08-07 15:26:33
---

## 初始化组件

一般我们会这样来初始化组件：

{% codeblock DOM结构 lang:html%}
<div id="container">
    <div data-ui-id="submitButton"></div>
</div>
{% endcodeblock %}

{% codeblock 初始化组件 lang:js%}
// 需要哪些组件，需要在这里事先把它们加载回来，比如我们这里用到了 `Button`
require(['moye', 'moye/Button'], function (moye) {

    moye.init(

        // 这里指定了组件所在的容器 DOM
        document.body,

        // 这里是初始化组件所需要的参数们
        {

            // 这个属性名与 DOM 结构上的 data-ui-id 相对应
            submitButton: {

                // 这是一个必须的参数，用来指定这个控件的类型
                type: 'Button',
                text: 'submit'
            }
        }
    );

});
{% endcodeblock %}

## 给组件绑定事件

一般我们会这样给组件绑定事件：

{% codeblock 绑定组件事件处理 lang:js%}

// 通过 moye.get() 来获取到指定 id 的控件实例，然后你就可以对它为所欲为啦
moye.get('sumbitButton').on('click', function () {
    alert('submit');
});

{% endcodeblock %}

## 创建新的组件实例

除了获取到组件模块后，通过`new Control()`的方式之外，我们还提供了一个简单的方法来创建实例：

{% codeblock 通过 moye.create() 创建实例 lang:js%}
var submitButton = moye.create('Button', {
    text: 'submit'
});

// 但这个时候，submitButton 还没有被挂载到 DOM 树上，是没有生效的。
// 你可以调用它的`appendTo()`方法来将它装载到 DOM 树上。
// `appendTo()`方法会自动判断组件当前是否已经渲染，如果没有渲染，那么它会先渲染，再挂载。
submitButton.appendTo(document.body);

{% endcodeblock %}

> 使用这个办法创建实例同样需要`Button`模块已经被加载到页面中，否则会抛出异常哟

