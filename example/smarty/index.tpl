<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>moye smarty develop demo</title>
    <link rel="stylesheet" href="./index.less">
    <script src="../js/esl.js"></script>
    <script src="../js/jquery-1.10.2.min.js"></script>
    <script>
    require.config({
      baseUrl: '../../src'
    });
    </script>
</head>
<body>
{%include file="../../src/tpl/smarty/base.tpl"%}
{%include file="./ui.json.tpl" assign="ui"%}
{%$ui = $ui|json_decode:true|escape:none%}


<main>

    <header>
        <img src="../img/moye.png" alt="">moye smarty预渲染模板demo
    </header>

    <section>
        {%include file="../../src/tpl/smarty/Button.tpl"%}
        <h3 class="demo-title">按钮</h3>
        <div>
            {%call Button data=$ui.button%}
        </div>
    </section>
    <section>
        {%include file="../../src/tpl/smarty/TextBox.tpl"%}

        <h3 class="demo-title">文本输入框</h3>

        <div>
            {%call TextBox data=$ui.textbox%}
        </div>
    </section>


    <section>
        {%include file="../../src/tpl/smarty/Select.tpl"%}
        <h3 class="demo-title">下拉选择框</h3>
        <div>
            {%call Select data=$ui.select%}
        </div>
    </section>

    <section>
        {%include file="../../src/tpl/smarty/Tab.tpl"%}
        <h3 class="demo-title">选项卡</h3>
        <div>
            {%call Tab data=$ui.tab%}
        </div>
        <div id="panel1" style="width: 100px;height: 100px; background-color: green; display: block"></div>
        <div id="panel2" style="width: 100px;height: 100px; background-color: blue; display: none"></div>
        <div id="panel3" style="width: 100px;height: 100px; background-color: red; display: none"></div>
        <div id="panel4" style="width: 100px;height: 100px; background-color: yellow; display: none"></div>
        <script>
        require(['ui/Tab', 'ui/plugin/TabBar'], function (Tab) {

            var tab = new Tab({
                main: document.getElementById('tab'),
                // mode: 'click',  // 默认为click
                plugins: ['TabBar']
            }).render();
        });
        </script>
    </section>

    <section>
        {%include file="../../src/tpl/smarty/Rating.tpl"%}
        <h3 class="demo-title">星号评级</h3>
        <div id="rating">
            {%call Rating data=$ui.rating%}
        </div>
        <script>
        require(['ui/Rating'], function (Rating) {
            var rating = new Rating({
                main: document.getElementById('rating')
            }).render();
        });
        </script>
    </section>

    <section>
        {%include file="../../src/tpl/smarty/BoxGroup.tpl"%}
        <h3 class="demo-title">单复选BoxGroup</h3>
        <div>
            {%call BoxGroup data=$ui.boxGroup%}
        </div>
        <script>
        require(['ui/BoxGroup'], function (BoxGroup) {
            var boxGroup = new BoxGroup({
                main: document.getElementById('boxGroup'),
                boxType: 'radio',
                styleClass: 'radio-point',
            }).render();
        });
        </script>
    </section>
    <section>
        {%include file="../../src/tpl/smarty/Pager.tpl"%}
        <h3 class="demo-title">分页</h3>
        <div>
            {%call Pager data=$ui.pager%}
        </div>
        <script>
            require(['ui/Pager'], function (Pager) {
                var pager = new Pager({
                    main: document.getElementById('pager'),
                    page: 1,
                    first: 1,
                    total: 10,
                    showCount: 5
                }).render();
            });
        </script>
    </section>
</main>


</body>
</html>
