{% extends "./_base.swig" %}
{% block header %}{% endblock %}

{% block style %}
{{ css('css/post.css') }}
{% endblock %}

{% block content %}{{ partial('_partial/article', {post: page, index: false}) }}{% endblock %}
