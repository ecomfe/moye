{% master: base %}
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>${name} - Moye</title>
<link rel="stylesheet" href="./css/common.less" />
<script src="http://s1.bdstatic.com/r/www/cache/ecom/esl/1-6-8/esl.js"></script>
<script src="http://s1.bdstatic.com/r/www/cache/static/jquery/jquery-1.10.2.min_f2fb5194.js"></script>
<script>
require.config({
  baseUrl: '../src/ui',
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
</body>
</html>