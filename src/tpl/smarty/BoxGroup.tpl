{%function name=BoxGroup dataClick=""%}{%strip%}

{%$defaultOpts = [] %}

{%$defaultOpts.type = 'BoxGroup' %}
{%$defaultOpts.boxType = 'checkbox' %}
{%$defaultOpts.activeClass = 'checked' %}
{%$defaultOpts.styleClass = 'default' %}
{%$defaultOpts.datasource = [] %}
{%$defaultOpts.value = [] %}

{%$data = array_merge($defaultOpts, $data) %}

{%if $data.boxType == 'radio' && count($data.value) > 1 %}
  {%$temp = array_splice($data.value, 1) %}
{%/if%}

<div {%if isset($data.id)%}id="{%$data.id%}"{%/if%} {%if isset($data.id)%}data-ui-id="{%$data.id%}"{%/if%} class="{%getPartClassName data=$data%}"  {%call dataClick data=$dataClick%} data-dom-inited="true">
    {%foreach $data.datasource as $item%}
    <label class="{%$data.styleClass%} {%if in_array($item.value, $data.value) %} {%$data.activeClass %} {%/if%}">
        <i class="icon icon-un"></i>
        <i class="icon icon-on"></i>
        <input type="{%$data.boxType%}" value="{%$item.value|escape:html%}" {%if in_array($item.value, $data.value) %} checked {%/if%}>
                 {%$item.name%}
    </label>
    {%/foreach%}
</div>

{%/strip%}{%/function%}
