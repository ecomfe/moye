{% spaceless %}
<header class="head">
    <div id="banner"></div>
    <div class="header">
        <a href="{{ url_for('/#top') }}"  class="header-title">
            <img src="{{ url_for('css/images/logo-small.png') }}" height="25">
            <h1>{{ config.title }}</h1>
        </a>
        <nav class="header-nav">
            {% for i in theme.menu %}
            {% if !loop.first %}
              <a class="header-nav-link" href="{{ url_for(i) }}">{{ loop.key }}</a>
            {% endif %}
            {% endfor %}
        </nav>
        <div class="header-github-star">
            <iframe src="https://ghbtns.com/github-btn.html?user=ecomfe&repo=moye&type=star&count=true" frameborder="0" scrolling="0" width="170px" height="20px"></iframe>
        </div>
    </div>
</header>
{% endspaceless %}
