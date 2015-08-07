{% extends "./_base.swig" %}
{% block style %}<link rel="stylesheet" href="/css/index.css">{% endblock %}

{% block content %}
    {{ partial('_partial/article', {post: page, index: false}) }}
{% endblock %}
