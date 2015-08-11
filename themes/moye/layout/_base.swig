<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title>{% block title %}{{ config.title }}{% endblock %}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    {% if theme.favicon %}
    <link rel="icon" href="{{ theme.favicon }}">
    {% endif %}
    {% if theme.twitter && theme.google_plus && theme.fb_admins && theme.fb_app_id %}
    {{ open_graph({twitter_id: theme.twitter, google_plus: theme.google_plus, fb_admins: theme.fb_admins, fb_app_id: theme.fb_app_id}) }}
    {% endif %}
    {% block style %}<link rel="stylesheet" href="/css/style.css">{% endblock %}
    {% if theme.rss %}
    <link rel="alternative" href="{{ theme.rss }}" title="{{ config.title }}" type="application/atom+xml">
    {% endif %}
</head>
<body>
    {% block header %}
        {% include "_partial/header.swig" %}
    {% endblock %}
    <div id="container">
    {% spaceless %}{% block content %}{% endblock %}{% endspaceless %}
    </div>
    {{ js("js/requirejs.min.js") }}
    {{ js("//libs.baidu.com/jquery/2.0.3/jquery.min.js") }}

    <script>
    require.config({
        'baseUrl': '{{ url_for("js") }}',
        'paths': {
            'common': './common',
            'highlight': '../dep/highlight/highlight.pack'
        },
        'packages': [{
            'name': 'moye',
            'location': '../dep/moye',
            'main': 'main'
        }],
        'urlArgs': 'v20150811'
    });
    </script>
    {% block script %}{% endblock %}
</body>
</html>
