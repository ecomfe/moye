title: 翻页器 / Pager
name: Pager
categories:
  - component
date: 2015-08-06 15:16:19
---

# Pager

## 简单版本

<iframe height='121' scrolling='no' src='//codepen.io/jinzhubaofu/embed/qdgoMz/?height=121&theme-id=17600&default-tab=result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>
    See the Pen <a href='http://codepen.io/jinzhubaofu/pen/qdgoMz/'>qdgoMz</a> by leon (<a href='http://codepen.io/jinzhubaofu'>@jinzhubaofu</a>) on <a href='http://codepen.io'>CodePen</a>.
</iframe>

## 设置总页面

与下拉框组合使用，设置总页码

<iframe height='228' scrolling='no' src='//codepen.io/jinzhubaofu/embed/zGeWmy/?height=228&theme-id=17600&default-tab=result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='http://codepen.io/jinzhubaofu/pen/zGeWmy/'>zGeWmy</a> by leon (<a href='http://codepen.io/jinzhubaofu'>@jinzhubaofu</a>) on <a href='http://codepen.io'>CodePen</a>.
</iframe>


## 自定义页码展现

<iframe height='256' scrolling='no' src='//codepen.io/jinzhubaofu/embed/zGeWmy/?height=256&theme-id=17600&default-tab=result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='http://codepen.io/jinzhubaofu/pen/zGeWmy/'>zGeWmy</a> by leon (<a href='http://codepen.io/jinzhubaofu'>@jinzhubaofu</a>) on <a href='http://codepen.io'>CodePen</a>.
</iframe>

## 精简版分页

<iframe height='266' scrolling='no' src='//codepen.io/jinzhubaofu/embed/oXmdqY/?height=266&theme-id=17600&default-tab=result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='http://codepen.io/jinzhubaofu/pen/oXmdqY/'>oXmdqY</a> by leon (<a href='http://codepen.io/jinzhubaofu'>@jinzhubaofu</a>) on <a href='http://codepen.io'>CodePen</a>.
</iframe>

## 精简版分页灵活运用

<iframe height='266' scrolling='no' src='//codepen.io/jinzhubaofu/embed/PqVeRQ/?height=266&theme-id=17600&default-tab=result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='http://codepen.io/jinzhubaofu/pen/PqVeRQ/'>PqVeRQ</a> by leon (<a href='http://codepen.io/jinzhubaofu'>@jinzhubaofu</a>) on <a href='http://codepen.io'>CodePen</a>.
</iframe>

## 分页getPage和setPage使用

<iframe height='266' scrolling='no' src='//codepen.io/jinzhubaofu/embed/KpJRoJ/?height=266&theme-id=17600&default-tab=result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='http://codepen.io/jinzhubaofu/pen/KpJRoJ/'>KpJRoJ</a> by leon (<a href='http://codepen.io/jinzhubaofu'>@jinzhubaofu</a>) on <a href='http://codepen.io'>CodePen</a>.
</iframe>

### 全部配置参数
------------------------

| 属性名        |类型        |   说明   |
| :--------    |:--------- | :------ |
| disabled     |boolean    |  控件的不可用状态  |
| main         |HTMLElement|  控件渲染容器  |
| page         |number     |  当前页（第一页从0开始）  |
| first        |number     |  起始页码，默认为0  |
| padding      |number     |  当页数较多时，首尾显示页码的个数  |
| showAlways   |boolean    |  是否一直显示分页控件  |
| showCount    |number     |  当页数较多时，中间显示页码的个数  |
| total        |number     |  总页数  |
| anchor       |string     |  跳转链接  |
| mode         |string     |  分页类型（normal/simple）  |
| getPageItemHTML    |function|  分页item字符串  |
| lang         |Object<string, string>|  用于显示上下页的文字  |
| lang.prev    |string     |  上一页显示文字(支持HTML)  |
| lang.next    |string     |  下一页显示文字(支持HTML)  |
| lang.ellipsis|string     |  省略处显示文字(支持HTML)  |

在页面切换的时候可以绑定回调事件`onChange`。
