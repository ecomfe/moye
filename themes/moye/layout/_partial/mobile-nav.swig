<nav id="mobile-nav">
  {% for i in theme.menu %}
    <a href="{{ url_for(theme.menu[i]) }}" class="mobile-nav-link">{{ i }}</a>
  {% endfor %}
</nav>