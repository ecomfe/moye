{% if post.link %}
  <h1 itemprop="name">
    <a class="{{ class_name }}" href="{{ url_for(post.link) }}" target="_blank" itemprop="url">{{ post.title }}</a>
  </h1>
{% elif post.title %}
  {% if index %}
    <h1 itemprop="name">
      <a class="{{ class_name }}" href="{{ url_for(post.path) }}">{{ post.title }}</a>
    </h1>
  {% else %}
    <h1 class="{{ class_name }}" itemprop="name">
      {{ post.title }}
      <!-- Place this tag where you want the button to render. -->
      <a class="github-button" href="https://github.com/ecomfe/moye" data-icon="octicon-star" data-style="mega" data-count-href="/ecomfe/moye/stargazers" data-count-api="/repos/ecomfe/moye#stargazers_count" data-count-aria-label="# stargazers on GitHub" aria-label="Star ecomfe/moye on GitHub">Star</a>
    </h1>
  {% endif %}
{% endif %}
