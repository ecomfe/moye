<nav class="article-nav">

  <a class="article-nav-logo" href="{{url_for('index.html')}}">
    <img src="{{ url_for('img/moye.png') }}" alt="moye" /> Moye
  </a>

  {% for category in site.data.nav %}
    <div class="article-nav-category">
      <h4 class="article-nav-category-title">{{ category.text }}</h4>
      {% for item in category.data %}
        <a class="article-nav-category-link {% if post.title == item.text %}current{%endif%}"
          href="{{ url_for(item.link) }}">
          {{ item.text }} {{ post.id }}
        </a>
      {% endfor %}
    </div>
  {% endfor %}

</nav>
