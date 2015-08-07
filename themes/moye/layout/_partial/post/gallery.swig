{% if post.photos && post.photos.length %}
<div class="article-gallery">
  <div class="article-gallery-photos">
    {% for photo in post.photos %}
      <a class="article-gallery-img fancybox" href="{{ url_for(photo) }}" rel="gallery_{{ post._id }}">
        <img src="{{ url_for(photo) }}" itemprop="image">
      </a>
    {% endfor %}
  </div>
</div>
{% endif %}