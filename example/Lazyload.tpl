{% target: Lazyload(master=base) %}

{% content: style %}

<style>
img {
    width: 375px;
    height: 526px;
    margin-left: 10px;
    background: #eee;
}
</style>
{% content: content %}

{%filter: markdown%}

# Lazyload 懒加载

## 示例

```js

var html = ['<div class="content"><div class="lazyload-img">'];
var img1 = '';
var img2 = 'http://bs.baidu.com/weigou-baidu-com/1427293449234/test.jpg';

for (var i = 0; i < 100; i++ ) {
    html.push('<img src="' + img1 + '" _src="' + img2 + '?_t=' + i + '" />');
}

html.push('</div></div>');

document.write(html.join(''));


require(['ui/Lazyload'], function (Lazyload) {
    var lazyload = new Lazyload({
        effect: 'fadeIn',
        effectSpeed: 600,
        delay: 20,
        offset: {
            y: 0
        },
        onLoad: function (img) {
            console.log(img);
        }
    });
});


```

## DEMO

<script>
var html = ['<div class="content"><div class="lazyload-img">'];
var img1 = '';
var img2 = 'http://bs.baidu.com/weigou-baidu-com/1427293449234/test.jpg';

for (var i = 0; i < 100; i++ ) {
    html.push('<img src="' + img1 + '" _src="' + img2 + '?_t=' + i + '" />');
}

html.push('</div></div>');

document.write(html.join(''));


require(['ui/Lazyload'], function (Lazyload) {
    var lazyload = new Lazyload({
        effect: 'fadeIn',
        effectSpeed: 600,
        delay: 20,
        offset: {
            y: 0
        },
        onLoad: function (img) {
            console.log(img);
        }
    });
    // lazyload.dispose();
});
</script>

{%/filter%}
