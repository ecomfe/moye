{%function name=Rating dataClick=""%}{%strip%}

{%$defaultOpts = [] %}

{%$defaultOpts.max = 5 %}
{%$defaultOpts.value = 0 %}

{%$data = array_merge($defaultOpts, $data) %}

<ul class="{%getPartClassName data=$data%}" {%if isset($data.id)%}data-ui-id="{%$data.id%}"{%/if%} data-dom-inited="true">
    {%for $index=1 to $data.max%}
    <li class="{%getPartClassName data=$data part="star"%}
    {%if $data.value >= $index%} {%getPartClassName data=$data part="star-on"%}{%/if%}" data-value="{%$index%}">
    {%if !isset($data.skin)%}&#9734;{%/if%}
    </li>
    {%/for%}
</ul>

{%/strip%}{%/function%}