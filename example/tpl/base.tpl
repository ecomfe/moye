{% master: base %}
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>${name} - Moye</title>
<link rel="stylesheet" href="./css/common.less" />
<script src="./js/esl.js"></script>
<script src="./js/jquery-1.10.2.min.js"></script>
<script>
require.config({
  baseUrl: '../src'
});
</script>
{% contentplaceholder: style %}
</head>
<body>
<div class="nav">
    <a href="#" class="logo"><img src="./img/moye.png" alt=""></a>
    <ul>
        {% for: ${controls} as ${control} %}
        <li><a href="${control.name}.tpl" class="{% if: ${control.name}.toLowerCase() == ${name}.toLowerCase() %}active{%/if%}">${control.name}</a>
        {% /for %}
    </ul>
</div>
<div class="container">
    <div id="main">
        {% contentplaceholder: content %}
    </div>
    <div id="dark-bg">
        <div id="top-nav">
            <ul id="lang-nav" class="ui-tab" data-ctrl-context="default" data-ctrl-id="moye-8">
                <li class="ui-tab-item ui-tab-item-first ui-tab-item-active" data-index="0">js</li>
                <li class="ui-tab-item" data-index="1">html</li>
            </ul>
        </div>
    </div>
</div>
<script>
require(['jquery', 'ui/lib', 'ui/Tab'], function ($, lib, Tab) {
    lib.fixed($('.nav')[0], {
        top: 0,
        left: 0,
        bottom: 0
    });

    var tab = [{
        title: 'js'
    }, {
        title: 'html'
    }];

    new Tab({
        main: document.getElementById('lang-nav'),
        tab: tab
    }).render().on('change', function (e) {
        switchCode(tab[e.activeIndex].title);
    });

    function switchCode(title) {
        $('pre code').each(function () {
            var code = $(this);
            var pre = code.parent();
            if (code.hasClass('lang-' + title)) {
                pre.show();
            }
            else {
                pre.hide();
            }
        });
    }
});
</script>
{% contentplaceholder: script %}
</body>
</html>
