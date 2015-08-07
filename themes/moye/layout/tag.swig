{% extends "./_base.swig" %}
{% block style %}<link rel="stylesheet" href="/css/index.css">{% endblock %}

{% block content %}{{ partial('_partial/archive', {pagination: config.tag, index: true}) }}{% endblock %}