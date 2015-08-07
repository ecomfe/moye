{% target: Lazy(master=base) %}

{% content: style %}

<style>
img {
    width: 270px;
    height: 129px;
}
</style>
{% content: content %}

{%filter: markdown%}

# Lazy 懒加载

## 示例

```js
var html = ['<div class="lazy-img">'];
var img1 = 'http://tb2.bdstatic.com/tb/static-common/img/search_logo_039c9b99.png';
var img2 = 'http://www.baidu.com/img/bdlogo.gif';
for (var i = 0; i < 100; i++ ) {
    html.push('<img src="' + img1 + '" _src="' + img2 + '" />');
}
html.push('</div>');
document.write(html.join(''));

require(['ui/LazyImg'], function (LazyImg) {
    LazyImg.load({
        offset: {
            y: 150
        }
    });
});
```

## DEMO

<script>
var html = ['<div class="content"><div class="lazy-img">'];
var img1 = 'http://tb2.bdstatic.com/tb/static-common/img/search_logo_039c9b99.png';
var img2 = 'http://www.baidu.com/img/bdlogo.gif';
for (var i = 0; i < 100; i++ ) {
    html.push('<img src="' + img1 + '" _src="' + img2 + '?_t=' + (i) + '" />');
}
html.push('</div></div>');

document.write(html.join(''));

require(['ui/LazyImg'], function (LazyImg) {
    LazyImg.load({
        offset: {
            y: 1250
        }
    });
});
</script>

{%/filter%}
