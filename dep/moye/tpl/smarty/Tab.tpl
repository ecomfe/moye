{%include "./base.tpl"%}
{%function name=Tab dataClick=""%}{%strip%}

{%$defaultOpts = [] %}

{%$defaultOpts.type = 'Tab' %}
{%$defaultOpts.plugins = [] %}
{%$defaultOpts.datasource = [] %}
{%$defaultOpts.activeIndex = 0 %}

{%$data = array_merge($defaultOpts, $data) %}

<div {%if isset($data.id)%}id="{%$data.id%}"{%/if%} {%if isset($data.id)%}data-ui-id="{%$data.id%}"{%/if%} class="{%getPartClassName data=$data%}"  {%call dataClick data=$dataClick%}>
    {%if isset($data.plugins) %}
        {%if in_array("TabBar", $data.plugins) %}
        <div class="{%getPartClassName data=$data part=bar%}"></div>
        {%/if%}
    {%/if%}

    <ul class="{%getPartClassName data=$data part=wrapper%}" >
        {%foreach $data.datasource as $item%}
        <li class="{%getPartClassName data=$data part="item "%}
        {%if $item@first%}
            {%getPartClassName data=$data part="item-first "%}
        {%/if%}
        {%if $item@last%}
            {%getPartClassName data=$data part="item-last "%}
        {%/if%} {%if $item@index eq $data.activeIndex%}
            {%getPartClassName data=$data part="item-active "%}
        {%/if%}
          "
        data-index="{%$item@index|escape:html%}"
        {%if isset($item.panel)%}
            data-panel="{%$item.panel|escape:html%}"
        {%/if%}
         >{%$item.text|escape:html%}</li>
        {%/foreach%}
    </ul>
</div>

{%/strip%}{%/function%}
