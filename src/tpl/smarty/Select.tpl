{%include "./base.tpl"%}
{%function name=Select dataClick=""%}{%strip%}
{%$moyeSelectValue=""%}
{%$label=$data.emptyText%}
{%if isset($data.datasource) and !empty($data.datasource) and isset($data.value) %}
    {%foreach $data.datasource as $option%}
    {%if $option.value == $data.value%}
        {%$label=$option.name%}
        {%$moyeSelectValue=$option.value%}
    {%/if%}
    {%/foreach%}
{%/if%}
<div {%if isset($data.id)%}id="{%$data.id%}"{%/if%}
    class="{%getPartClassName data=$data%}" data-ui-id="{%$data.id%}"
    {%if !empty($moyeSelectValue)%}data-value="{%$moyeSelectValue|escape:html%}"{%/if%}
    {%call dataClick data=$dataClick%}>
    <input type="hidden" id="{%getPartId data=$data part=input%}" {%if isset($data.name) and $data.name%}name="{%$data.name%}"{%/if%} value="{%$moyeSelectValue|escape:html%}">
    <a href="#" id="{%getPartId data=$data part=label%}" class="{%getPartClassName data=$data part=label%}">
        <span>{%$label|escape:none%}</span>
        {%if isset($data.icon) and !empty($data.icon)%}
            {%if is_string($data.icon)%}
                {%$data.icon|escape:none%}
            {%elseif $data.icon === true%}
                <i></i>
            {%/if%}
        {%/if%}
    </a>
</div>
{%/strip%}{%/function%}
