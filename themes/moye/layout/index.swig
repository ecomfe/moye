{% extends "./_base.swig" %}

{% block style %}
{{ css('css/index.css') }}
{% endblock %}

{% block content %}
<div class="main">
    <img src="{{ url_for('css/images/bg.png') }}" class="main-bg">
    <div class="main-content">
        <p class="main-title">MOYE</p>
        <p class="main-text">一个轻便的UI组件库</p>
        <div class="main-btn"><a href="/api">开始体验</a></div>
    </div>
</div>

<div class="examples">
    <div class="examples-row examples-html">
        <div class="examples-row-left">
            <h2>简洁的 HTML</h2>
            <p>Moye 使用非常简洁易懂的语言来命名类名，并且脱离了标签的束缚。</p>
        </div>
        <div class="examples-row-right">
            <pre>
            <code class="html">
            <p>{{ '<div class="ui-button">按钮1</div>'|escape }}</p>
            <p>{{ '<a class="ui-button">按钮2</a>'|escape }}</p>
            <p>{{ '<button class="ui-button">按钮3</button>'|escape }}</p>
            </code>
            </pre>
            <div class="examples-result">
                <div class="ui-button">按钮1</div>
                <a class="ui-button">按钮2</a>
                <button class="ui-button">按钮3</button>
            </div>
        </div>
    </div>
    <div class="examples-row examples-smarty">
        <div class="examples-row-left">
            <h2>支持 Smarty 渲染</h2>
            <p>Moye 提供了多种控件的 smarty 模板，帮助您生成统一的 html 代码，节省编写复杂的 html 结构的时间。</p>
        </div>
        <div class="examples-row-right">
            <pre>
            <code class="html">
            <p>{{'{%Select data={"datasource":[{"value": 0,"name": "不限"}, {"value": 1,"name": "中关村、上地"}, {"value": 2,"name": "公主坟商圈"}, {"value": 3,"name": "劲松潘家园"}, {"value": 4,"name": "亚运村"}, {"value": 5,"name": "北京南站商圈超长"}]}%}'|escape }}</p>
            </code>
            </pre>
            <div class="examples-result">
                <div id="select" class="ui-select"></div>
            </div>
        </div>
    </div>
    <div class="examples-row examples-js">
        <div class="examples-row-left">
            <h2>直观的 JavaScript</h2>
            <p>Moye 的所有控件和插件都提供了统一的接口，用户只需要修改配置参数，就可以得到想要的功能。</p>
        </div>
        <div class="examples-row-right">
            <h3>javascript</h3>
            <pre>
            <code class="javascript">
var Tab = require('moye/Tab');
new Tab({
    main: $('#tab')
}).render();
            </code>
            </pre>
            <h3>html</h3>
            <pre>
            <code class="html">
            <p>{{ '{%Tab data={"datasource": [{"text": "昨日"},{"text": "近1周"},{"text": "近1月"}]}%}'|escape }}</p>
            </code>
            </pre>
            <div class="examples-result">
                <div class="ui-tab" id="tab">
                    <ul class="ui-tab-wrapper">
                        <li data-index="0" class="ui-tab-item ui-tab-item-active">昨日</li>
                        <li data-index="1" class="ui-tab-item">近1周</li>
                        <li data-index="2" class="ui-tab-item">近1月</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <div class="examples-row examples-theme">
        <div class="examples-row-left">
            <h2>多样的主题</h2>
            <p>Moye 提供了多种多样的主题，用一套相同的代码，可以添加多重样式</p>
        </div>
        <div class="examples-row-right">
            <h3>javascript</h3>
            <pre>
            <code class="javascript">
var Pager = require('moye/Pager');
new Pager({
    main: $('#pager1'),
    total: 10
}).render();
new Pager({
    main: $('#pager2'),
    skin: 'qiche',
    total: 10
}).render();
new Pager({
    main: $('#pager3'),
    skin: 'jiaoyu',
    total: 10
}).render();
new Pager({
    main: $('#pager4'),
    skin: 'youxi',
    total: 10
}).render();
            </code>
            </pre>

            <div class="examples-result">
                <div class="ui-pager" id="pager1"></div>
                <div class="ui-pager" id="pager2"></div>
                <div class="ui-pager" id="pager3"></div>
                <div class="ui-pager" id="pager4"></div>
            </div>
        </div>
    </div>
</div>

<div class="feature">
    <img src="{{ url_for('css/images/bg.png') }}" class="feature-bg">
    <div class="feature-content">
        <div class="feature-left">
            <div class="feature-img"></div>
            <p>最全的网页控件</p>
            <p>最小的传输体积</p>
            <h1>性能优</h1>
        </div>
        <div class="feature-mid">
            <div class="feature-img"></div>
            <p>100+样式变量</p>
            <p>多达20余种插件支持</p>
            <h1>功能全</h1>
        </div>
        <div class="feature-right">
            <div class="feature-img"></div>
            <p>Free Open Source</p>
            <p>灵活的自定义扩展</p>
            <h1>可扩展</h1>
        </div>
    </div>
</div>

<div class="slogan">
    <h1>释放你的</h1>
    <div class="slogan-logo"></div>
    <span id="triangle-up"></span>
    <a href="#top" target="_self">TOP</a>
</div>

<div class="links">
    <div class="links-content">
        <div class="links-content-left">
            <h2>友情链接</h2>
            {% for i in theme["friend_links"] %}
                <a class="links-content-link" href="{{ i }}" target="_blank">{{ loop.key }}</a>
            {% endfor %}
        </div>
        <div class="links-content-mid">
            <h2>更多</h2>
            <a class="links-content-link" href="" target="_blank">License</a>
            <a class="links-content-link" href="" target="_blank">Changelog</a>
        </div>
        <div class="links-content-right">
            <h2>联系我们</h2>
            <a class="links-content-link" href="http://www.baidu.com" target="_blank">www.baidu.com</a>
            <a class="links-content-link" href="https://github.com/ecomfe/moye" target="_blank">Github</a>
            <a class="links-content-link" href="" target="_blank">Weibo</a>
        </div>
    </div>
    <div class="links-copyright">© 2015 Baidu Powered by <a href="http://hexo.io/" target="_blank">Hexo</a></div>
</div>
{% endblock %}

{% block script %}
<script>
require(['index'], function (index) {
    index.enter();
});
</script>
{% endblock %}
