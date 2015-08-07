{% if pagination == 2 %}
  {%  for post in page.posts %}
    {{ partial('article', {post: post, index: true}) }}
  {% endfor %}
  {% if page.total > 1 %}
    <nav id="page-nav">
      {{ paginator({prev_text: '&laquo; Prev', next_text: 'Next &raquo;'}) }}
    </nav>
  {% endif %}
{% else %}
  {% set last = null %}
  {% for post in page.posts %}
    {% set year = post.date.year() %}
    {% if last != year %}
      {% if last != null %}
        </div></section>
      {% endif %}
      {% set last = year %}
      <section class="archives-wrap">
        <div class="archive-year-wrap">
          <a href="{{ url_for('archives/' + year) }}" class="archive-year">{{ year }}</a>
        </div>
        <div class="archives">
    {% endif %}
    {{ partial('archive-post', {post: post, even: loop.index0 % 2 == 0}) }}
  {% endfor %}
  {% if page.posts.length %}
    </div></section>
  {% endif %}
{% endif %}