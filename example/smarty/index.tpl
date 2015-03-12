<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>moye smarty develop demo</title>
    <link rel="stylesheet" href="./index.less">
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

</main>


</body>
</html>
