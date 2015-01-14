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
{% contentplaceholder: content %}
</div>
{% contentplaceholder: script %}
<script>
require(['jquery', 'ui/lib'], function ($, lib) {
    lib.fixed($('.nav')[0], {
        top: 0,
        left: 0,
        bottom: 0
    });
});
</script>
</body>
</html>
