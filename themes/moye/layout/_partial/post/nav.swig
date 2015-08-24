<nav class="article-nav">

  <a class="article-nav-logo" href="{{url_for('/')}}">
    <img src="{{ url_for('img/moye.png') }}" alt="moye" /> Moye
  </a>

  {% for category in site.data.nav %}
    <div class="article-nav-category">
      <h4 class="article-nav-category-title">
        {% if category.link %}
        <a class="article-nav-category-link" href={{ url_for(category.link) }}>{{ category.text }}</a>
        {% else %}
        {{ category.text }}
        {% endif %}
      </h4>

      {% for item in category.data %}
        <a class="article-nav-category-link {% if post.title == item.text %}current{%endif%}"
          href="{{ url_for(item.link) }}">
          {{ item.text }} {{ post.id }}
        </a>
      {% endfor %}
    </div>
  {% endfor %}

</nav>
